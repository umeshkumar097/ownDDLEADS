import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
        }

        // Find the token
        const resetTokenList = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
        const resetToken = resetTokenList[0];

        if (!resetToken) {
            return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
        }

        // Check expiration
        if (new Date() > new Date(resetToken.expires)) {
            await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
            return NextResponse.json({ error: 'Token has expired. Please request a new password reset.' }, { status: 400 });
        }

        // Find user by email
        const userList = await db.select().from(users).where(eq(users.email, resetToken.identifier));
        const user = userList[0];

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and ensure email is verified just in case
        await db.update(users).set({
            password: hashedPassword,
            emailVerified: user.emailVerified || new Date()
        }).where(eq(users.id, user.id));

        // Delete the token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

        return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
