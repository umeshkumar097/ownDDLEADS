import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;

        const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userDb[0];

        // Ensure user has a referral code
        let refCode = user?.referralCode;
        if (!refCode && user) {
            refCode = `NEXUS-${user.id.substring(0, 5).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
            await db.update(users).set({ referralCode: refCode }).where(eq(users.id, userId));
        }

        // Calculate hours until next claim
        const now = new Date();
        const lastClaim = user?.lastLogin ? new Date(user.lastLogin) : new Date(0);
        const diffMs = now.getTime() - lastClaim.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        let hoursLeft = 0;
        let canClaim = false;

        if (diffHrs < 24) {
            hoursLeft = 24 - diffHrs;
        } else {
            canClaim = true;
        }

        return NextResponse.json({
            success: true,
            streakDays: user?.streakDays || 0,
            referralCode: refCode,
            canClaim,
            hoursUntilNextClaim: hoursLeft
        });

    } catch (error: any) {
        console.error("Fetch Rewards Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
