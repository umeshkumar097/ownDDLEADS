import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, "info@aiclex.in")
        });

        if (!user) {
            console.log("Creating info@aiclex.in admin account...");
            const hashedPassword = await bcrypt.hash("Umesh@2003##", 10);
            await db.insert(users).values({
                name: "Umesh Admin",
                email: "info@aiclex.in",
                password: hashedPassword,
                role: "admin",
                phone: "+910000000000",
                emailVerified: new Date()
            });
            return NextResponse.json({ success: true, message: "Admin info@aiclex.in dynamically seeded with password." });
        }

        await db.update(users).set({ role: 'admin' }).where(eq(users.email, "info@aiclex.in"));

        return NextResponse.json({ success: true, message: "Role updated to admin successfully for info@aiclex.in", previousRole: user.role });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
