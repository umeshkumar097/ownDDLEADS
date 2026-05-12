import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users, allTransactions } from '@/db/schema';
import { desc, notExists, sql } from 'drizzle-orm';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.email !== 'info@aiclex.co.in') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query users who have NO successful transactions
        const leads = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            createdAt: users.emailVerified,
        })
        .from(users)
        .where(
            notExists(
                db.select()
                  .from(allTransactions)
                  .where(
                      sql`${allTransactions.userId} = ${users.id} AND ${allTransactions.status} = 'SUCCESS'`
                  )
            )
        )
        .orderBy(desc(users.emailVerified))
        .limit(500);

        return NextResponse.json({ leads });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
