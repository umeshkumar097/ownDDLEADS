import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Missing verification token.' }, { status: 400 });
        }

        // Find the token
        const vtList = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
        const verificationToken = vtList[0];

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
        }

        // Check expiration
        if (new Date() > new Date(verificationToken.expires)) {
            await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
            return NextResponse.json({ error: 'Token has expired. Please register again.' }, { status: 400 });
        }

        // Find user by email
        const userList = await db.select().from(users).where(eq(users.email, verificationToken.identifier));
        const user = userList[0];

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 400 });
        }

        // Verify user email
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));

        // Delete the token
        await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

        return NextResponse.json({ success: true, message: 'Email verified successfully.' });

    } catch (error: any) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal server error during verification.' }, { status: 500 });
    }
}
