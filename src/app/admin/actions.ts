'use server';

import { db } from '@/db';
import { users, creditsBalance, adminAuditLogs, withdrawalRequests, broadcastMessages, pricingPlans } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Utility to verify Admin permissions
async function verifyAdmin() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    // We already query the user from DB to bypass strict NextAuth interface extension issues here
    const liveServerUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string)
    });

    if (!liveServerUser || liveServerUser.role !== 'admin') {
        throw new Error('Unauthorized: Requires Admin Role');
    }

    return session.user.id as string;
}

// 1. User Management Actions
export async function overrideCredits(userId: string, newTotalAmount: number, reason: string) {
    const adminId = await verifyAdmin();

    await db.update(creditsBalance)
        .set({ totalCredits: newTotalAmount })
        .where(eq(creditsBalance.userId, userId));

    await db.insert(adminAuditLogs).values({
        adminId: adminId,
        actionType: 'CREDIT_OVERRIDE',
        description: `Set total credits to ${newTotalAmount}. Reason: ${reason}`,
        targetId: userId
    });
    return { success: true };
}

export async function toggleUserBan(userId: string, currentStatus: boolean, reason: string) {
    const adminId = await verifyAdmin();

    await db.update(users)
        .set({ isBanned: !currentStatus })
        .where(eq(users.id, userId));

    await db.insert(adminAuditLogs).values({
        adminId: adminId,
        actionType: !currentStatus ? 'USER_BAN' : 'USER_UNBAN',
        description: `Reason: ${reason}`,
        targetId: userId
    });
    return { success: true };
}

// 2. Treasury Actions
export async function markPayoutPaid(requestId: number) {
    const adminId = await verifyAdmin();

    const request = await db.query.withdrawalRequests.findFirst({
        where: eq(withdrawalRequests.id, requestId)
    });

    if (!request) throw new Error('Request not found');

    await db.update(withdrawalRequests)
        .set({
            status: 'completed',
            processedAt: new Date()
        })
        .where(eq(withdrawalRequests.id, requestId));

    await db.insert(adminAuditLogs).values({
        adminId: adminId,
        actionType: 'PAYOUT_APPROVE',
        description: `Marked payout request #${requestId} of ₹${request.amount} as Paid.`,
        targetId: request.userId
    });
    return { success: true };
}

// 3. Global Broadcast Actions
export async function setGlobalBroadcast(message: string, durationHours: number) {
    const adminId = await verifyAdmin();

    // Deactivate previous active messages
    await db.update(broadcastMessages)
        .set({ isActive: false })
        .where(eq(broadcastMessages.isActive, true));

    if (message.trim().length > 0) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + durationHours);

        await db.insert(broadcastMessages).values({
            message,
            isActive: true,
            expiresAt
        });

        await db.insert(adminAuditLogs).values({
            adminId: adminId,
            actionType: 'BROADCAST_SET',
            description: `Set global broadcast: "${message}"`
        });
    }

    return { success: true };
}

export async function getActiveBroadcast() {
    const activeMessages = await db.query.broadcastMessages.findMany({
        where: eq(broadcastMessages.isActive, true),
        orderBy: [desc(broadcastMessages.createdAt)],
        limit: 1
    });

    const active = activeMessages[0];

    if (active && active.expiresAt && new Date() > active.expiresAt) {
        // Expired, mark inactive
        await db.update(broadcastMessages).set({ isActive: false }).where(eq(broadcastMessages.id, active.id));
        return null;
    }

    return active ? active.message : null;
}

// 4. Admin Overview Stats
export async function getAdminStats() {
    await verifyAdmin();

    const { usageLogs, allTransactions } = await import('@/db/schema');
    const { sum } = await import('drizzle-orm');

    // Total leads generated all time
    const leadsResult = await db.select({ count: sum(usageLogs.creditsDeducted) }).from(usageLogs);
    const totalLeadsGenerated = leadsResult[0]?.count || 0;

    // Real numbers from allTransactions
    const transactionsResult = await db.select({ totalAmount: sum(allTransactions.amount), totalCredits: sum(allTransactions.creditsAdded) }).from(allTransactions);
    const totalCreditsPurchased = transactionsResult[0]?.totalCredits || 0;
    const totalCreditsBurned = totalLeadsGenerated;

    const recentLogs = await db.select({
        id: usageLogs.id,
        action: usageLogs.action,
        creditsDeducted: usageLogs.creditsDeducted,
        timestamp: usageLogs.timestamp,
        userEmail: users.email,
        userName: users.name,
        userRole: users.role
    })
        .from(usageLogs)
        .leftJoin(users, eq(users.id, usageLogs.userId))
        .orderBy(desc(usageLogs.timestamp))
        .limit(10);

    return {
        totalLeadsGenerated: Number(totalLeadsGenerated).toLocaleString(),
        totalCreditsPurchased: totalCreditsPurchased.toLocaleString(),
        totalCreditsBurned: Number(totalCreditsBurned).toLocaleString(),
        recentLogs
    };
}

// 5. Pricing Administration
export async function getPricingPlans() {
    return await db.query.pricingPlans.findMany({
        orderBy: (pricingPlans, { asc }) => [asc(pricingPlans.priceInINR)]
    });
}

export async function updatePricingPlan(id: number, data: { planName: string, priceInINR: number, creditsAwarded: number, isPopular: boolean, features: string[] }) {
    const adminId = await verifyAdmin();

    await db.update(pricingPlans)
        .set({
            planName: data.planName,
            priceInINR: data.priceInINR,
            creditsAwarded: data.creditsAwarded,
            isPopular: data.isPopular,
            features: data.features,
            updatedAt: new Date(),
        })
        .where(eq(pricingPlans.id, id));

    await db.insert(adminAuditLogs).values({
        adminId: adminId,
        actionType: 'PRICING_UPDATE',
        description: `Updated Pricing Plan ID #${id}: ${data.planName} to ₹${data.priceInINR} for ${data.creditsAwarded} credits.`
    });

    return { success: true };
}
