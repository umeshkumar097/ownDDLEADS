import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone } = await req.json();
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
        }

        await db.update(users)
            .set({ phone, updatedAt: new Date() })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Phone update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
