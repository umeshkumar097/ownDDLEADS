'use server';

import { db } from '@/db';
import { agencies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function updateBranding(formData: FormData) {
    const session = await auth();
    if (!session || !session.user.agencyId) {
        throw new Error("Unauthorized");
    }

    const name = formData.get('name') as string;
    const logoUrl = formData.get('logoUrl') as string;
    const faviconUrl = formData.get('faviconUrl') as string;
    const brandColor = formData.get('brandColor') as string;

    await db.update(agencies).set({
        name,
        logoUrl: logoUrl || null,
        faviconUrl: faviconUrl || null,
        brandColor: brandColor || '#0f172a',
        updatedAt: new Date(),
    }).where(eq(agencies.id, session.user.agencyId));

    revalidatePath('/agency/settings');
    revalidatePath('/', 'layout'); // Refresh branding globally
    return { success: true };
}
