import { NextResponse } from 'next/server';
import { stripe } from '@/lib/auth';
import { db } from '@/db';
import { subscriptions, users, creditsBalance, creditTransactions, partnerships, referralStats } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPurchaseConfirmationEmail } from '@/lib/brevo';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No Stripe signature found' }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const mode = session.mode;

        if (mode === 'payment') {
            // This is a one-off "Credit Add-On" purchase
            const creditsPurchased = parseInt(session.metadata.creditsAmount || '0', 10);
            const userId = session.metadata.userId;
            const referralCode = session.metadata?.referralCode;
            const amountInr = session.amount_total ? session.amount_total / 100 : 0;

            if (creditsPurchased > 0 && userId) {
                const currentBalance = await db.query.creditsBalance.findFirst({
                    where: eq(creditsBalance.userId, userId)
                });

                if (currentBalance) {
                    await db.update(creditsBalance)
                        .set({ totalCredits: (Number(currentBalance.totalCredits) + creditsPurchased).toString() })
                        .where(eq(creditsBalance.userId, userId));
                } else {
                    await db.insert(creditsBalance).values({
                        userId: userId,
                        totalCredits: (10 + creditsPurchased).toString(),
                        creditsUsed: '0'
                    });
                }

                // Log the transaction
                await db.insert(creditTransactions).values({
                    userId: userId,
                    type: 'credit',
                    amount: creditsPurchased.toString(),
                    action: 'purchased',
                    description: `Purchased ${creditsPurchased} Lead Credits via Stripe`
                });

                // Send Purchase Confirmation Email via Brevo
                const user = await db.query.users.findFirst({
                    where: eq(users.id, userId)
                });

                if (user && user.email) {
                    await sendPurchaseConfirmationEmail(
                        user.email,
                        user.name || 'User',
                        creditsPurchased,
                        amountInr
                    ).catch(err => console.error("Failed to send receipt:", err));
                }

                // --- 1. Eligibility Check ---
                let userPartnership = await db.query.partnerships.findFirst({
                    where: eq(partnerships.userId, userId)
                });

                if (!userPartnership) {
                    const newRefCode = crypto.randomBytes(4).toString('hex').toUpperCase();
                    const [inserted] = await db.insert(partnerships).values({
                        userId: userId,
                        referralCode: newRefCode,
                        isEligible: amountInr >= 499
                    }).returning();
                    userPartnership = inserted;
                } else if (!userPartnership.isEligible && amountInr >= 499) {
                    await db.update(partnerships)
                        .set({ isEligible: true })
                        .where(eq(partnerships.id, userPartnership.id));
                }

                // --- 2. Commission Engine ---
                if (referralCode) {
                    const referrerPartnership = await db.query.partnerships.findFirst({
                        where: eq(partnerships.referralCode, referralCode)
                    });

                    if (referrerPartnership && referrerPartnership.userId !== userId && referrerPartnership.isEligible) {
                        const referrerId = referrerPartnership.userId;

                        let refStat = await db.query.referralStats.findFirst({
                            where: and(
                                eq(referralStats.referrerId, referrerId),
                                eq(referralStats.referredUserId, userId)
                            )
                        });

                        let currentPurchaseCount = refStat ? refStat.purchaseCount + 1 : 1;
                        let commissionPercent = 0.01; // 1% lifetime
                        if (currentPurchaseCount === 1) commissionPercent = 0.20; // 20% on 1st
                        else if (currentPurchaseCount === 2) commissionPercent = 0.05; // 5% on 2nd

                        const commissionAmount = amountInr * commissionPercent;

                        if (!refStat) {
                            await db.insert(referralStats).values({
                                referrerId: referrerId,
                                referredUserId: userId,
                                purchaseCount: 1,
                                totalCommissionGenerated: commissionAmount.toString()
                            });
                        } else {
                            await db.update(referralStats)
                                .set({
                                    purchaseCount: currentPurchaseCount,
                                    totalCommissionGenerated: sql`${referralStats.totalCommissionGenerated} + ${commissionAmount}`
                                })
                                .where(eq(referralStats.id, refStat.id));
                        }

                        // Add commission to referrer's vault
                        await db.update(partnerships)
                            .set({
                                totalEarned: sql`${partnerships.totalEarned} + ${commissionAmount}`,
                                withdrawableBalance: sql`${partnerships.withdrawableBalance} + ${commissionAmount}`
                            })
                            .where(eq(partnerships.id, referrerPartnership.id));
                    }
                }
            }
        }
    }

    return NextResponse.json({ received: true });
}
