import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appsumoCodes, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
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

        const allCodesCountResult = await db.select({ value: count() }).from(appsumoCodes);
        const redeemedCodesCountResult = await db.select({ value: count() }).from(appsumoCodes).where(eq(appsumoCodes.isRedeemed, true));

        const total = allCodesCountResult[0].value;
        const redeemed = redeemedCodesCountResult[0].value;
        const unused = total - redeemed;

        return NextResponse.json({ total, redeemed, unused }, { status: 200 });

    } catch (error: any) {
        console.error("AppSumo Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
