import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { partnerships, withdrawalRequests } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { amount, paymentDetails } = body;

        if (!amount || amount <= 0 || !paymentDetails) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const partnershipData = await db.query.partnerships.findFirst({
            where: eq(partnerships.userId, session.user.id)
        });

        if (!partnershipData || !partnershipData.isEligible) {
            return NextResponse.json({ error: 'You are not eligible for the partnership program.' }, { status: 403 });
        }

        if (Number(partnershipData.withdrawableBalance) < amount) {
            return NextResponse.json({ error: 'Insufficient withdrawable balance.' }, { status: 400 });
        }

        // Create Withdrawal Request
        await db.insert(withdrawalRequests).values({
            userId: session.user.id,
            amount: amount.toString(),
            paymentDetails: paymentDetails,
            status: 'pending'
        });

        // Deduct from withdrawable balance
        await db.update(partnerships)
            .set({
                withdrawableBalance: sql`${partnerships.withdrawableBalance} - ${amount}`
            })
            .where(eq(partnerships.id, partnershipData.id));

        return NextResponse.json({ success: true, message: 'Withdrawal requested successfully.' });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
