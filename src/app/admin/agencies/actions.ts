'use server';

import { db } from '@/db';
import { agencies, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createAgency(formData: FormData) {
    const name = formData.get('name') as string;
    const subdomain = formData.get('subdomain') as string;
    const email = formData.get('email') as string;

    if (!name || !subdomain || !email) {
        throw new Error("Missing required fields");
    }

    // 1. Find the user who will be the agency admin
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (!user) {
        throw new Error("User with this email not found. Please ask them to register first.");
    }

    // 2. Create the agency
    const result = await db.insert(agencies).values({
        name,
        subdomain: subdomain.toLowerCase(),
        adminId: user.id,
        status: 'active',
        brandColor: '#0f172a',
    }).returning() as any;

    const newAgency = result[0];

    // 3. Update the user's role and agencyId
    await db.update(users).set({
        role: 'agency_admin',
        agencyId: newAgency.id,
    }).where(eq(users.id, user.id));

    revalidatePath('/admin/agencies');
    return newAgency;
}
