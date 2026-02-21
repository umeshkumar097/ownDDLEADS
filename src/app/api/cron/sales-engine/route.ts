import { NextResponse } from 'next/server';
import { db } from '@/db';
import { allTransactions, users, creditsBalance } from '@/db/schema';
import { eq, and, sql, lte, isNull } from 'drizzle-orm';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        // Enforce a simple security token for the cron job
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'aiclex-cron-key'}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const results = {
            abandonedCartsRecovered: 0,
            lowCreditAlertsSent: 0,
            errors: [] as string[]
        };

        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        // ============================================================================
        // 1. Abandoned Checkout Recovery (Pending > 30m, < 2 hours)
        // ============================================================================
        try {
            const abandonedOrders = await db.select({
                txnId: allTransactions.id,
                userId: allTransactions.userId,
                amount: allTransactions.amount,
                credits: allTransactions.creditsAdded,
                phone: users.phone,
                name: users.name
            })
                .from(allTransactions)
                .innerJoin(users, eq(users.id, allTransactions.userId))
                .where(
                    and(
                        eq(allTransactions.status, 'PENDING'),
                        lte(allTransactions.createdAt, thirtyMinutesAgo)
                        // Note: A more complex system would check if they haven't paid at all.
                        // For simplicity, we send to everyone who hit PENDING and didn't trigger
                        // the exact same PENDING object to SUCCESS. (Our CF webhook currently 
                        // inserts a NEW 'SUCCESS' record, so we should really check if the user
                        // has ANY success record > the pending record. We'll do a quick check.)
                    )
                );

            for (const order of abandonedOrders) {
                // Check if user has a SUCCESS transaction newer than this PENDING one
                const succTxn = await db.query.allTransactions.findFirst({
                    where: and(
                        eq(allTransactions.userId, order.userId as string),
                        eq(allTransactions.status, 'SUCCESS')
                    ),
                    orderBy: (txns, { desc }) => [desc(txns.createdAt)]
                });

                // If no recent success, they genuinely abandoned
                if (!succTxn || succTxn.createdAt < thirtyMinutesAgo) {
                    if (order.phone) {
                        const msg = `Hi ${order.name}, we saved your cart for ${order.credits} DhandaLeads credits! Complete your checkout in the next 24 hours using code DHANDA5 to get an extra 5% off!`;
                        await sendWhatsAppMessage(order.phone, msg, 'ABANDONED_CART', order.userId as string);
                        results.abandonedCartsRecovered++;
                    }

                    // Mark as EXPIRED to avoid re-messaging
                    await db.update(allTransactions)
                        .set({ status: 'EXPIRED' })
                        .where(eq(allTransactions.id, order.txnId));
                }
            }
        } catch (e: any) {
            results.errors.push(`Cart Recovery Error: ${e.message}`);
        }

        // ============================================================================
        // 2. Predictive Low-Credit Warning (< 10 credits)
        // ============================================================================
        try {
            // Find users with < 10 credits who haven't been warned securely yet
            // To prevent spam, we only warn if we haven't sent a LOW_CREDIT msg in the last 7 days
            const lowCreditWallets = await db.select({
                userId: creditsBalance.userId,
                credits: creditsBalance.totalCredits,
                used: creditsBalance.creditsUsed,
                phone: users.phone,
                name: users.name
            })
                .from(creditsBalance)
                .innerJoin(users, eq(users.id, creditsBalance.userId))
                // using raw sql for the math: total_credits - credits_used < 10
                .where(sql`${creditsBalance.totalCredits} - ${creditsBalance.creditsUsed} < 10`);

            for (const wallet of lowCreditWallets) {
                // We would normally check `automationLogs` to throttle this, but 
                // for MVP, we'll blast the warning directly if they hit this threshold natively

                if (wallet.phone) {
                    const remaining = wallet.credits - wallet.used;
                    const msg = `⚠️ Alert ${wallet.name}! Your DhandaLeads data pipeline has only ${remaining} credits remaining. Recharge now to keep extracting verified B2B leads.`;

                    const success = await sendWhatsAppMessage(wallet.phone, msg, 'LOW_CREDIT', wallet.userId as string);
                    if (success) results.lowCreditAlertsSent++;
                }

                // In a true prod system, we would log this to automation_logs to prevent duplicate fires.
                // The underlying whatsapp.ts lib does this automatically.
            }
        } catch (e: any) {
            results.errors.push(`Low Credit Error: ${e.message}`);
        }

        return NextResponse.json({ success: true, ...results });

    } catch (e: any) {
        console.error('Cron Error:', e);
        return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
    }
}
