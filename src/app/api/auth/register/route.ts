import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import disposableDomains from 'disposable-email-domains';
import { sendVerificationEmail, sendAdminNewUserAlert } from '@/lib/brevo';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, password, utmSource, utmMedium, utmCampaign } = body;

        if (!name || !email || !phone || !password) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Validate email domain against disposable domains
        const domain = email.split('@')[1]?.toLowerCase();
        if (disposableDomains.includes(domain)) {
            return NextResponse.json({ error: 'Temporary or disposable email domains are not allowed.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
        }

        // Check if user already exists
        const existingUsers = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'Email is already registered.' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [newUser] = await db.insert(users).values({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            utmSource,
            utmMedium,
            utmCampaign
        }).returning();

        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hours validity

        await db.insert(verificationTokens).values({
            identifier: email.toLowerCase(),
            token,
            expires
        });

        // Send Verification Email via Brevo
        await sendVerificationEmail(newUser.email, newUser.name || 'User', token).catch(err => console.error("Verification email failed:", err));

        // Notify Admin
        await sendAdminNewUserAlert({ 
            name: newUser.name || 'Unknown', 
            email: newUser.email, 
            phone: newUser.phone || 'N/A' 
        }).catch(err => console.error("Admin alert failed:", err));

        return NextResponse.json({ success: true, message: 'Registration successful! Please check your email to verify your account.' }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error during registration.' }, { status: 500 });
    }
}
