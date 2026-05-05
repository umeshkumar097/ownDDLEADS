import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, appsumoCodes, creditsBalance, usageLogs, adminAuditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const userId = session.user.id as string;

        const body = await req.json();
        const { licenseKey } = body;

        if (!licenseKey) {
            return NextResponse.json({ error: "License key is required." }, { status: 400 });
        }

        const trimmedKey = licenseKey.trim();

        // Start transaction for atomic redemption
        const result = await db.transaction(async (tx) => {
            // Find the code
            const codeRecord = await tx.select().from(appsumoCodes).where(eq(appsumoCodes.licenseKey, trimmedKey)).limit(1);

            if (codeRecord.length === 0) {
                return { error: "Invalid AppSumo code.", status: 404 };
            }

            const code = codeRecord[0];

            if (code.isRedeemed) {
                return { error: "This code has already been redeemed. Please contact support.", status: 400 };
            }

            // Determine credit reward based on Tier Level Default (Adjust these numbers based on actual AppSumo plan)
            let creditReward = 5000;
            if (code.tierLevel === 2) creditReward = 15000;
            if (code.tierLevel === 3) creditReward = 50000;

            // Mark code as redeemed
            await tx.update(appsumoCodes)
                .set({
                    isRedeemed: true,
                    redeemedByUserId: userId,
                    redeemedAt: new Date(),
                })
                .where(eq(appsumoCodes.id, code.id));

            // Upgrade User Membership
            await tx.update(users)
                .set({ membershipType: 'LTD' })
                .where(eq(users.id, userId));

            // Provision Credits
            const existingBalance = await tx.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);
            if (existingBalance.length > 0) {
                await tx.update(creditsBalance)
                    .set({ totalCredits: (Number(existingBalance[0].totalCredits) + creditReward).toString() })
                    .where(eq(creditsBalance.userId, userId));
            } else {
                await tx.insert(creditsBalance).values({
                    userId: userId,
                    totalCredits: (creditReward + 10).toString(), // Assuming +10 base free credits
                    creditsUsed: '0'
                });
            }

            // Log the redemption securely
            await tx.insert(usageLogs).values({
                userId: userId,
                action: 'APPSUMO_REDEMPTION',
                creditsDeducted: '0',
                details: `Redeemed Tier ${code.tierLevel} AppSumo code: ${trimmedKey}. Rewarded ${creditReward} credits.`,
            });

            // System Audit
            await tx.insert(adminAuditLogs).values({
                adminId: 'SYSTEM',
                actionType: 'APPSUMO_REDEEMED',
                targetId: userId,
                description: `User redeemed AppSumo code ${trimmedKey} (Tier ${code.tierLevel})`,
            });

            return { success: true, tierLevel: code.tierLevel, awardedCredits: creditReward };
        });

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json({
            success: true,
            message: "AppSumo Code Redeemed Successfully! Welcome to Lifetime Access.",
            tierLevel: result.tierLevel,
            awardedCredits: result.awardedCredits
        }, { status: 200 });

    } catch (error: any) {
        console.error("AppSumo Redemption Error:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
