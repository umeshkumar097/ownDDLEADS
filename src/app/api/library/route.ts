import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { lists, leads, creditsBalance, users, allTransactions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;

        // Get all lists
        const userLists = await db.select().from(lists)
            .where(eq(lists.userId, userId))
            .orderBy(desc(lists.createdAt));

        // Get all leads (for the Kanban dashboard to fetch saved folder data)
        const userLeads = await db.select().from(leads)
            .where(eq(leads.userId, userId))
            .orderBy(desc(leads.createdAt));

        // Get available credits
        let availableCredits = 0;
        const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const userRole = userDb[0];

        if (userRole?.role === 'pro') {
            availableCredits = 9999; // Unlimited concept for UI
        } else {
            const balanceRecord = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);
            if (balanceRecord.length > 0) {
                availableCredits = Math.max(0, balanceRecord[0].totalCredits - balanceRecord[0].creditsUsed);
            }
        }

        // Phase 17: Welcome Offer Status
        const transactions = await db.select().from(allTransactions).where(eq(allTransactions.userId, userId)).limit(1);
        const hasPurchased = transactions.length > 0;

        return NextResponse.json({
            success: true,
            lists: userLists,
            leads: userLeads,
            credits: availableCredits,
            user: {
                emailVerified: userRole?.emailVerified,
                hasPurchased: hasPurchased,
                membershipType: userRole?.membershipType || 'free'
            }
        });

    } catch (error: any) {
        console.error("Fetch Library Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
