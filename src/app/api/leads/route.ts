import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;
        const { searchParams } = new URL(req.url);
        const leadId = searchParams.get('id');

        if (!leadId) {
            return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
        }

        // Verify ownership and delete
        const result = await db.delete(leads)
            .where(
                and(
                    eq(leads.id, leadId),
                    eq(leads.userId, userId)
                )
            )
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Lead not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Lead deleted successfully' });

    } catch (error: any) {
        console.error("Delete Lead Error:", error);
        return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
}
