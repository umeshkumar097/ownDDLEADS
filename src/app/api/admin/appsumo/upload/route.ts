import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appsumoCodes, users, adminAuditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id as string;

        const adminCheck = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { codes, tierLevel } = body;

        if (!Array.isArray(codes) || codes.length === 0 || !tierLevel) {
            return NextResponse.json({ error: "Invalid payload. Provide an array of codes and a tierLevel." }, { status: 400 });
        }

        // Chunking array to avoid exceeding SQL params limit
        const chunkSize = 1000;
        let insertedCount = 0;

        for (let i = 0; i < codes.length; i += chunkSize) {
            const chunk = codes.slice(i, i + chunkSize);
            const valuesToInsert = chunk.map(code => ({
                licenseKey: code,
                tierLevel: Number(tierLevel),
                isRedeemed: false,
            }));

            // onConflictDoNothing to avoid crashing on duplicate AppSumo Codes uploads
            const result = await db.insert(appsumoCodes)
                .values(valuesToInsert)
                .onConflictDoNothing({ target: appsumoCodes.licenseKey })
                .returning();

            insertedCount += result.length;
        }

        // Log to Admin Audit
        await db.insert(adminAuditLogs).values({
            adminId: userId,
            actionType: 'APPSUMO_CODES_UPLOADED',
            targetId: 'SYSTEM',
            description: `Admin uploaded ${insertedCount} new codes to Tier ${tierLevel}.`,
        });

        return NextResponse.json({ success: true, inserted: insertedCount }, { status: 200 });

    } catch (error: any) {
        console.error("AppSumo Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload codes." }, { status: 500 });
    }
}
