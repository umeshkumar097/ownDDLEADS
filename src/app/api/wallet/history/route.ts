import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { creditTransactions } from '@/db/schema';
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

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error('Error fetching wallet history:', error);
        return NextResponse.json({ error: 'Failed to fetch transaction history' }, { status: 500 });
    }
}
