import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/brevo';
import crypto from 'crypto';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 });
        }

        const email = session.user.email;

        // Ensure user exists
        const userList = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
        const user = userList[0];

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
        }

        // Generate a new verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hours validity

        await db.insert(verificationTokens).values({
            identifier: email.toLowerCase(),
            token,
            expires
        });

        // Dispatch email via Nodemailer
        const sent = await sendVerificationEmail(user.email, user.name || 'User', token);

        if (!sent) {
            return NextResponse.json({ error: 'Failed to dispatch email via SMTP provider. Please try again later.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Verification email sent successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Internal server error while resending verification.' }, { status: 500 });
    }
}
