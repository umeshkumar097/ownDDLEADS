import { NextResponse } from 'next/server';
import { db } from '@/db';
import { systemHealthLogs } from '@/db/schema';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { errorType, errorMessage, urlAffected, userAgent } = body;

        await db.insert(systemHealthLogs).values({
            errorType: errorType?.substring(0, 100) || 'UNKNOWN_ERROR',
            errorMessage: errorMessage || 'No message provided',
            urlAffected: urlAffected || 'Unknown URL',
            userAgent: userAgent || 'Unknown Agent',
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error logging to DB:', err);
        return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
    }
}
