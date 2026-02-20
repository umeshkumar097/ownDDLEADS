import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/brevo';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();

        // Find user by email
        const userList = await db.select().from(users).where(eq(users.email, normalizedEmail));
        const user = userList[0];

        // Do not reveal if user does not exist to prevent enumeration attacks, 
        // just pretend it succeeded
        if (!user || !user.password) {
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // 1 hour validity

        // Remove any old tokens for this email
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.identifier, normalizedEmail));

        await db.insert(passwordResetTokens).values({
            identifier: normalizedEmail,
            token,
            expires
        });

        // Send Reset Email via Brevo
        await sendPasswordResetEmail(user.email, token).catch(err => console.error("Forgot email failed:", err));

        return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
