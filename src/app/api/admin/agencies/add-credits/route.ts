import { db } from "@/db";
import { agencies } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth();

    // Only admins can add credits to agencies
    if (!session?.user || session.user.role !== 'admin') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { agencyId, amount } = await req.json();

        if (!agencyId || !amount || isNaN(amount)) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        await db.update(agencies)
            .set({
                totalCredits: sql`${agencies.totalCredits} + ${amount}`
            })
            .where(eq(agencies.id, agencyId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[AGENCY_ADD_CREDITS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
