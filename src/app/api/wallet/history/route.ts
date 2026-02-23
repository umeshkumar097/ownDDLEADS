import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { creditTransactions, creditsBalance } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await db.select()
            .from(creditTransactions)
            .where(eq(creditTransactions.userId, session.user.id))
            .orderBy(desc(creditTransactions.createdAt));

        // Fetch Real-time Credit Balance safely without relying on static JWT token
        let availableCredits = 0;
        const balanceRecord = await db.select()
            .from(creditsBalance)
            .where(eq(creditsBalance.userId, session.user.id))
            .limit(1);

        if (balanceRecord.length > 0) {
            availableCredits = Math.max(0, balanceRecord[0].totalCredits - balanceRecord[0].creditsUsed);
        }

        return NextResponse.json({ transactions, availableCredits });
    } catch (error) {
        console.error('Error fetching wallet history:', error);
        return NextResponse.json({ error: 'Failed to fetch transaction history' }, { status: 500 });
    }
}
