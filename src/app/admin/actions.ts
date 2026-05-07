'use server';

import { db } from '@/db';
import { users, creditsBalance, adminAuditLogs, withdrawalRequests, broadcastMessages, pricingPlans } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { sendBonusCreditsEmail } from '@/lib/brevo';

// Utility to verify Admin permissions
async function verifyAdmin() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    // We already query the user from DB to bypass strict NextAuth interface extension issues here
    const [liveServerUser] = await db.select().from(users).where(eq(users.id, session.user.id as string)).limit(1);

    if (!liveServerUser || liveServerUser.role !== 'admin') {
        throw new Error('Unauthorized: Requires Admin Role');
    }

    return session.user.id as string;
}

// 1. User Management Actions
export async function overrideCredits(userId: string, newTotalAmount: number, reason: string) {
    const adminId = await verifyAdmin();

    // Fetch user details to get email/name for notification
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new Error('User not found');

    // Check if balance record exists
    const balance = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);

    let oldTotal = 0;
    if (balance.length > 0) {
        oldTotal = Number(balance[0].totalCredits || '0');
        // Update existing
        await db.update(creditsBalance)
            .set({ totalCredits: newTotalAmount.toString() })
            .where(eq(creditsBalance.userId, userId));
    } else {
        // Create new record
        await db.insert(creditsBalance).values({
            userId: userId,
            totalCredits: newTotalAmount.toString(),
            creditsUsed: '0'
        });
    }

    // Phase: Notify User if credits were ADDED
    if (newTotalAmount > oldTotal) {
        const delta = newTotalAmount - oldTotal;
        try {
            await sendBonusCreditsEmail(user.email, user.name || 'DhandaLeads Member', delta);
        } catch (error) {
            console.error("Failed to send credit bonus email:", error);
            // We don't throw here to avoid failing the DB transaction just because of email failure
        }
    }

    await db.insert(adminAuditLogs).values({
        adminId: adminId,
        actionType: 'CREDIT_OVERRIDE',
        description: `Set total credits to ${newTotalAmount} (Old: ${oldTotal}). Reason: ${reason}`,
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

    const [request] = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, requestId)).limit(1);

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
    try {
        const activeMessages = await db.select().from(broadcastMessages)
            .where(eq(broadcastMessages.isActive, true))
            .orderBy(desc(broadcastMessages.createdAt))
            .limit(1);

        const active = activeMessages[0];

        if (active && active.expiresAt && new Date() > active.expiresAt) {
            // Expired, mark inactive
            await db.update(broadcastMessages).set({ isActive: false }).where(eq(broadcastMessages.id, active.id));
            return null;
        }

        return active ? active.message : null;
    } catch (error) {
        console.error("Failed to fetch broadcast messages during build/runtime:", error);
        return null;
    }
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
    const transactionsResult = await db.select({ totalAmount: sum(allTransactions.amount), totalCredits: sum(allTransactions.creditsAdded) })
        .from(allTransactions)
        .where(eq(allTransactions.status, 'SUCCESS'));
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
    return await db.select().from(pricingPlans).orderBy(pricingPlans.priceInINR);
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

// 6. Phase 11: SEO Engine Administration
export async function getSeoMetadata() {
    await verifyAdmin();
    const { seoCities, seoKeywords } = await import('@/db/schema');

    const cities = await db.select().from(seoCities).orderBy(seoCities.name);
    const keywords = await db.select().from(seoKeywords).orderBy(seoKeywords.keyword);

    return { cities, keywords };
}

export async function toggleSeoCity(id: number, currentStatus: boolean) {
    const adminId = await verifyAdmin();
    const { seoCities } = await import('@/db/schema');

    await db.update(seoCities).set({ isActive: !currentStatus }).where(eq(seoCities.id, id));

    await db.insert(adminAuditLogs).values({
        adminId,
        actionType: 'SEO_CITY_TOGGLE',
        description: `Toggled City ID #${id} to ${!currentStatus}`
    });
    return { success: true };
}

export async function toggleSeoKeyword(id: number, currentStatus: boolean) {
    const adminId = await verifyAdmin();
    const { seoKeywords } = await import('@/db/schema');

    await db.update(seoKeywords).set({ isActive: !currentStatus }).where(eq(seoKeywords.id, id));

    await db.insert(adminAuditLogs).values({
        adminId,
        actionType: 'SEO_KEYWORD_TOGGLE',
        description: `Toggled Keyword ID #${id} to ${!currentStatus}`
    });
    return { success: true };
}

export async function updateSeoKeywordContext(id: number, contextParagraph: string) {
    const adminId = await verifyAdmin();
    const { seoKeywords } = await import('@/db/schema');

    await db.update(seoKeywords).set({ contextParagraph }).where(eq(seoKeywords.id, id));

    await db.insert(adminAuditLogs).values({
        adminId,
        actionType: 'SEO_CONTEXT_UPDATE',
        description: `Updated context paragraph for Keyword ID #${id}`
    });
    return { success: true };
}

export async function addSeoCity(name: string, state: string) {
    const adminId = await verifyAdmin();
    const { seoCities } = await import('@/db/schema');

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
        await db.insert(seoCities).values({ name, slug, state, isActive: true });

        await db.insert(adminAuditLogs).values({
            adminId,
            actionType: 'SEO_CITY_ADD',
            description: `Added new SEO City: ${name}`
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addSeoKeyword(keyword: string, intentHeadline: string) {
    const adminId = await verifyAdmin();
    const { seoKeywords } = await import('@/db/schema');

    const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
        await db.insert(seoKeywords).values({
            keyword,
            slug,
            intentHeadline,
            contextParagraph: '',
            isActive: true
        });

        await db.insert(adminAuditLogs).values({
            adminId,
            actionType: 'SEO_KEYWORD_ADD',
            description: `Added new SEO Keyword: ${keyword}`
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function bulkAddSeoCities(csvData: string) {
    const adminId = await verifyAdmin();
    const { seoCities } = await import('@/db/schema');

    const lines = csvData.split('\n').filter(l => l.trim().length > 0);
    let added = 0;

    for (const line of lines) {
        const parts = line.split(',');
        const name = parts[0].trim();
        const state = parts.length > 1 ? parts[1].trim() : 'India';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        try {
            await db.insert(seoCities).values({ name, slug, state, isActive: true }).onConflictDoNothing();
            added++;
        } catch (e: any) {
            console.error(`Failed to bulk add city ${name}:`, e);
        }
    }

    await db.insert(adminAuditLogs).values({
        adminId,
        actionType: 'SEO_CITY_BULK_ADD',
        description: `Bulk Added ${added} SEO Cities`
    });

    return { success: true, count: added };
}

export async function bulkAddSeoKeywords(csvData: string) {
    const adminId = await verifyAdmin();
    const { seoKeywords } = await import('@/db/schema');

    const lines = csvData.split('\n').filter(l => l.trim().length > 0);
    let added = 0;

    for (const line of lines) {
        const parts = line.split('|');
        const keyword = parts[0].trim();
        const intentHeadline = parts.length > 1 ? parts[1].trim() : `Top ${keyword}`;
        const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        try {
            await db.insert(seoKeywords).values({
                keyword,
                slug,
                intentHeadline,
                contextParagraph: '',
                isActive: true
            }).onConflictDoNothing();
            added++;
        } catch (e: any) {
            console.error(`Failed to bulk add keyword ${keyword}:`, e);
        }
    }

    await db.insert(adminAuditLogs).values({
        adminId,
        actionType: 'SEO_KEYWORD_BULK_ADD',
        description: `Bulk Added ${added} SEO Keywords`
    });

    return { success: true, count: added };
}
