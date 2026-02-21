'use server';

import { auth } from '@/lib/auth';
import { db } from '@/db';
import { apiKeys, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function generateApiKey() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Generate a random 32-byte API Secret
        const secret = crypto.randomBytes(32).toString('hex');
        const token = `ddl_${secret}`; // ddl_ = DhandaLeads 

        // Hash it for DB storage
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        // Check if user already has a key, we limit to 1 per user for Phase 15 MVP
        const existing = await db.select().from(apiKeys).where(eq(apiKeys.userId, session.user.id));
        if (existing.length > 0) {
            // Update existing
            await db.update(apiKeys)
                .set({ keyHash: hash, createdAt: new Date() })
                .where(eq(apiKeys.userId, session.user.id));
        } else {
            // Insert new
            await db.insert(apiKeys).values({
                userId: session.user.id,
                keyHash: hash,
            });
        }

        return { success: true, token }; // Need to display token ONCE
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to generate key. Please try again.' };
    }
}

export async function revokeApiKey() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { error: 'Unauthorized' };
    }

    try {
        await db.delete(apiKeys).where(eq(apiKeys.userId, session.user.id));
        return { success: true };
    } catch (e: any) {
        return { error: 'Failed to revoke key.' };
    }
}
