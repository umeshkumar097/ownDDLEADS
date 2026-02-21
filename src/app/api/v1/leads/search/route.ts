import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, creditsBalance, usageLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        // 1. Authorize Request
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ddl_')) {
            return NextResponse.json({ error: 'Missing or invalid API Key' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Validate Key
        const keyRecords = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, hash)).limit(1);

        if (keyRecords.length === 0) {
            return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
        }

        const userId = keyRecords[0].userId;

        // 3. Parse Request
        const body = await req.json();
        const city = body.city || 'Delhi';
        const industry = body.industry || 'Software';
        const limitCount = parseInt(body.limit) || 10;

        // Cost: 10 Credits per API Search Request
        const API_COST = 10;

        // 4. Verify Balance
        const balanceRecords = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);

        if (balanceRecords.length === 0 || balanceRecords[0].totalCredits < API_COST) {
            return NextResponse.json({ error: `Insufficient Credits. This API call requires ${API_COST} credits.` }, { status: 402 });
        }

        const balance = balanceRecords[0];

        // 5. Build Enterprise Lead Payload (Simulated AI Scraping / DB Query)
        const leads = Array.from({ length: Math.min(limitCount, 20) }).map((_, i) => ({
            id: crypto.randomUUID(),
            name: `Enterprise Contact ${i + 1}`,
            jobTitle: ['CTO', 'Director of Sales', 'Founder', 'VP Marketing'][Math.floor(Math.random() * 4)],
            company: `${industry} Innovations ${city} Ltd.`,
            email: `contact${i + 1}@${industry.toLowerCase().replace(/\s/g, '')}innovations.in`,
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            linkedin: `linkedin.com/in/enterprise-contact-${i + 1}`,
            location: city,
            confidenceScore: Math.floor(85 + Math.random() * 15),
        }));

        // 6. Deduct Credits
        await db.update(creditsBalance)
            .set({
                totalCredits: balance.totalCredits - API_COST,
                creditsUsed: balance.creditsUsed + API_COST,
                updatedAt: new Date()
            })
            .where(eq(creditsBalance.userId, userId));

        // 7. Log Usage
        await db.insert(usageLogs).values({
            userId,
            action: 'enterprise_api_search',
            creditsDeducted: API_COST,
            details: `API Search: ${industry} in ${city} (Returned ${leads.length} leads)`,
            timestamp: new Date()
        });

        // 8. Update Key Last Used
        await db.update(apiKeys)
            .set({ lastUsedAt: new Date() })
            .where(eq(apiKeys.keyHash, hash));

        return NextResponse.json({
            success: true,
            meta: {
                creditsDeducted: API_COST,
                remainingCredits: balance.totalCredits - API_COST,
                resultsCount: leads.length,
            },
            data: leads,
        });

    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
    }
}
