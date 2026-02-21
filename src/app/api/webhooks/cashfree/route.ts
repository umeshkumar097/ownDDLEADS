import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions, users, creditsBalance, creditTransactions, partnerships, referralStats, allTransactions } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPurchaseConfirmationEmail } from '@/lib/brevo';

// Cashfree Signature Verification Function
function verifyCashfreeSignature(payloadStr: string, signature: string, timestamp: string) {
    const rawData = timestamp + payloadStr;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY as string)
        .update(rawData)
        .digest('base64');
    return expectedSignature === signature;
}

export async function POST(req: Request) {
    const bodyStr = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
        return NextResponse.json({ error: 'Missing Cashfree signature headers' }, { status: 400 });
    }

    if (!verifyCashfreeSignature(bodyStr, signature, timestamp)) {
        return NextResponse.json({ error: 'Invalid Cashfree signature' }, { status: 400 });
    }

    let payload;
    try {
        payload = JSON.parse(bodyStr);
    } catch (err: any) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Process Successful Payment
    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
        const orderId = payload.data.order.order_id;
        const amountInr = payload.data.order.order_amount;
        const customerId = payload.data.customer_details.customer_id;
        const paymentData = payload.data.payment;

        // Custom tags we injected during order creation
        const tags = payload.data.order.order_tags || {};
        const creditsPurchased = parseInt(tags.credits || '0', 10);
        const userId = Object.keys(tags).length > 0 ? tags.userId : customerId; // Fallback if tags missing
        const referralCode = tags.referralCode;
        const sourceCity = tags.sourceCity;
        const sourceKeyword = tags.sourceKeyword;

        if (paymentData.payment_status === 'SUCCESS' && creditsPurchased > 0 && userId) {

            // 0. Ensure we haven't processed this exact webhook before (Idempotency check via transactions)
            const existingTxn = await db.query.allTransactions.findFirst({
                where: eq(allTransactions.gatewayTxnId, paymentData.cf_payment_id.toString())
            });

            if (existingTxn) {
                return NextResponse.json({ received: true, message: 'Already processed' });
            }

            // Record transaction specifically in God Eye Ledger
            await db.insert(allTransactions).values({
                userId: userId,
                amount: amountInr.toString(),
                creditsAdded: creditsPurchased,
                gatewayTxnId: paymentData.cf_payment_id.toString(),
                status: 'SUCCESS',
                sourceCity: sourceCity || null,
                sourceKeyword: sourceKeyword || null
            });

            // 1. Credit Balance Update
            const currentBalance = await db.query.creditsBalance.findFirst({
                where: eq(creditsBalance.userId, userId)
            });

            if (currentBalance) {
                await db.update(creditsBalance)
                    .set({ totalCredits: currentBalance.totalCredits + creditsPurchased })
                    .where(eq(creditsBalance.userId, userId));
            } else {
                await db.insert(creditsBalance).values({
                    userId: userId,
                    totalCredits: 10 + creditsPurchased,
                    creditsUsed: 0
                });
            }

            // 2. Log User Transaction History
            await db.insert(creditTransactions).values({
                userId: userId,
                type: 'credit',
                amount: creditsPurchased,
                action: 'purchased',
                description: `Purchased ${creditsPurchased} Lead Credits via Cashfree`
            });

            // 3. Send Purchase Confirmation Email via Brevo
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

            // --- 4. Eligibility Check ---
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

            // --- 5. Commission Engine ---
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

    return NextResponse.json({ received: true });
}
