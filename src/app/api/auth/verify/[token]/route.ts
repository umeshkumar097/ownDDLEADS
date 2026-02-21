import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {
    try {
        const { token } = await context.params;

        if (!token) {
            return new NextResponse('Missing verification token.', { status: 400 });
        }

        // Find the token
        const vtList = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
        const verificationToken = vtList[0];

        if (!verificationToken) {
            return NextResponse.redirect(new URL('/login?error=InvalidToken', req.url));
        }

        // Check expiration
        if (new Date() > new Date(verificationToken.expires)) {
            await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
            return NextResponse.redirect(new URL('/login?error=TokenExpired', req.url));
        }

        // Find user by email
        const userList = await db.select().from(users).where(eq(users.email, verificationToken.identifier));
        const user = userList[0];

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=UserNotFound', req.url));
        }

        // Verify user email
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));

        // Delete the token
        await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

        // Redirect to login with success flag
        return NextResponse.redirect(new URL('/login?verified=true', req.url));

    } catch (error: any) {
        console.error('Verification error:', error);
        return new NextResponse('Internal server error during verification.', { status: 500 });
    }
}
