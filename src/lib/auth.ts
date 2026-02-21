import NextAuth from 'next-auth';
import Stripe from 'stripe';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2025-01-27.acacia' as any,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: { strategy: 'jwt' },
    trustHost: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const userList = await db.select().from(users).where(eq(users.email, (credentials.email as string).toLowerCase()));
                const user = userList[0];

                if (!user || !user.password) {
                    throw new Error("User not found or uses Google Login");
                }

                if (user.isBanned) {
                    throw new Error("Your account has been banned due to policy violations.");
                }

                // if (!user.emailVerified) {
                //    throw new Error("Please verify your email address first.");
                // }

                const isValid = await bcrypt.compare(credentials.password as string, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // First time login
            if (user) {
                token.id = user.id;
            }

            // We removed the inline `db.query` check here because running a database
            // hit on EVERY SINGLE authenticated request (next.js edge hydration) 
            // exhausts the connection pool and creates a sweeping ETIMEDOUT Server Error loop.
            // Banned status is correctly intercepted at initial login via authorize().

            return token;
        },
        async session({ session, token }) {
            if (session?.user && token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
});
