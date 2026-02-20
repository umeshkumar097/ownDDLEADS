import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { partnerships, referralStats, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const partnershipData = await db.query.partnerships.findFirst({
            where: eq(partnerships.userId, session.user.id)
        });

        const referralsData = await db.select({
            referredName: users.name,
            referredEmail: users.email,
            purchaseCount: referralStats.purchaseCount,
            commission: referralStats.totalCommissionGenerated,
            createdAt: referralStats.createdAt
        })
            .from(referralStats)
            .leftJoin(users, eq(referralStats.referredUserId, users.id))
            .where(eq(referralStats.referrerId, session.user.id))
            .orderBy(desc(referralStats.createdAt));

        return NextResponse.json({
            isEligible: partnershipData?.isEligible || false,
            referralCode: partnershipData?.referralCode || null,
            totalEarned: partnershipData?.totalEarned || 0,
            withdrawableBalance: partnershipData?.withdrawableBalance || 0,
            referrals: referralsData
        });
    } catch (error) {
        console.error('Error fetching partnership stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
