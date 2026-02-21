import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { allTransactions } from '@/db/schema';
import WelcomeBanner from '@/components/WelcomeBanner';

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

    // Phase 17: Welcome Offer Calculation Server-Side
    const transactions = await db.select().from(allTransactions).where(eq(allTransactions.userId, liveServerUser.id)).limit(1);
    const hasPurchased = transactions.length > 0;

    return (
        <div className="flex flex-col min-h-screen">
            <WelcomeBanner
                emailVerifiedAt={liveServerUser.emailVerified.toISOString()}
                hasPurchased={hasPurchased}
            />
            {children}
        </div>
    );
}
