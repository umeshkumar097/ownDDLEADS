import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users, creditsBalance, usageLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;

        // 1. Get user and balance
        const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userDb[0];

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const balanceRecord = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);
        const balance = balanceRecord[0];

        const now = new Date();
        const lastClaim = user.lastLogin ? new Date(user.lastLogin) : new Date(0);

        // Calculate diff in hours
        const diffMs = now.getTime() - lastClaim.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHrs < 24) {
            return NextResponse.json({ error: `Already claimed today. Come back in ${24 - diffHrs} hours.` }, { status: 400 });
        }

        let newStreak = user.streakDays + 1;

        // If they missed more than 48 hours, reset streak
        if (diffHrs > 48) {
            newStreak = 1;
        }

        // Generate Referral Code if they don't have one yet
        let refCode = user.referralCode;
        if (!refCode) {
            refCode = `NEXUS-${user.id.substring(0, 5).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
        }

        // Add 5 credits as a daily reward
        if (balance) {
            await db.update(creditsBalance)
                .set({
                    totalCredits: (Number(balance.totalCredits) + 5).toString(),
                    updatedAt: new Date()
                })
                .where(eq(creditsBalance.userId, userId));
        }

        // Update User Profile
        await db.update(users)
            .set({
                streakDays: newStreak,
                lastLogin: now,
                referralCode: refCode
            })
            .where(eq(users.id, userId));

        // Log transaction
        await db.insert(usageLogs).values({
            userId,
            action: 'daily_reward',
            creditsDeducted: '-5', // Negative deduction represents addition in logs
            details: `Claimed daily reward. New streak: ${newStreak} days.`
        });

        return NextResponse.json({
            success: true,
            reward: 5,
            streak: newStreak,
            referralCode: refCode
        });

    } catch (error: any) {
        console.error("Reward Claim Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
