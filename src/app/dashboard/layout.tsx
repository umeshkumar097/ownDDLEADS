import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect('/login');
    }

    const liveServerUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string)
    });

    if (!liveServerUser) {
        redirect('/login');
    }

    if (!liveServerUser.emailVerified) {
        redirect('/verify-email');
    }

    return <>{children}</>;
}
