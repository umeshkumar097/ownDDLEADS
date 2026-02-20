import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { lists, leads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;
        const { searchParams } = new URL(req.url);
        const listId = searchParams.get('id');

        if (!listId) {
            return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
        }

        // Verify ownership
        const listToVerify = await db.select().from(lists).where(eq(lists.id, listId)).limit(1);

        if (listToVerify.length === 0 || listToVerify[0].userId !== userId) {
            return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 403 });
        }

        // Delete all leads in this list first (or let cascade handle if configured, executing manually to be safe)
        await db.delete(leads).where(eq(leads.listId, listId));

        // Delete the list itself
        await db.delete(lists).where(eq(lists.id, listId));

        return NextResponse.json({ success: true, message: 'Folder and its leads deleted successfully.' });

    } catch (error: any) {
        console.error("Delete List Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
