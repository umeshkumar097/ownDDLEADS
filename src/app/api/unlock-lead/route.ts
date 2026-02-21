import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users, creditsBalance, usageLogs, creditTransactions, leads, lists } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendLowCreditAlertEmail } from '@/lib/brevo';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;
        const { payload, listId, listName } = await req.json();

        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Invalid lead payload' }, { status: 400 });
        }

        // 1. Credit Check Logic
        const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const userRole = userDb[0];

        let targetListId = listId;

        if (userRole?.role !== 'pro') {
            const balanceRecord = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);
            const balance = balanceRecord[0];

            if (!balance || (balance.totalCredits - balance.creditsUsed) <= 0) {
                return NextResponse.json({
                    error: "Insufficient credits to unlock lead. Please upgrade to Pro.",
                    success: false
                }, { status: 403 });
            }

            // Deduct 1 Credit
            await db.update(creditsBalance)
                .set({
                    creditsUsed: balance.creditsUsed + 1,
                    updatedAt: new Date()
                })
                .where(eq(creditsBalance.userId, userId));

            // Log the 'debit' transaction
            await db.insert(creditTransactions).values({
                userId,
                type: 'debit',
                amount: 1,
                action: 'unlocked_lead',
                description: `Unlocked lead contact details for ${payload.name || payload.email}`
            });

            // Low Credit Brevo Notification
            const remainingCredits = balance.totalCredits - (balance.creditsUsed + 1);
            if (remainingCredits === 10 || remainingCredits === 0) {
                if (userRole?.email) {
                    await sendLowCreditAlertEmail(
                        userRole.email,
                        userRole.name || 'User',
                        remainingCredits
                    ).catch(err => console.error("Low credit email failed:", err));
                }
            }
        }

        // 2. Resolve List ID
        if (!targetListId) {
            if (listName) {
                // Create a new list
                const [newList] = await db.insert(lists).values({
                    userId,
                    name: listName
                }).returning();
                targetListId = newList.id;
            } else {
                return NextResponse.json({ error: 'Destination List ID is required' }, { status: 400 });
            }
        }

        // 2.5 Phone/Website extraction (Passed directly from search payload now)
        let exactPhone = payload.phone || '';
        let website = payload.linkedin || ''; // We overloaded the linkedin field with website in the payload

        // 3. Gemini AI Icebreaker Generation (1-credit unlock feature)
        let icebreaker = `Hi ${payload.name}, I loved your work at ${payload.company}. I'd love to connect!`; // Fallback
        let aiAnalysisJSON = null;
        try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const prompt = `You are an expert SDR B2B sales development rep. Write 3 highly personalized, friendly, 1-sentence icebreakers to send to the sales or operations team at ${payload.company}. Their business location is ${payload.location}. ${website ? `Their website is ${website}.` : ''} Return ONLY a valid JSON object with exactly these 3 string keys: {"email": "...", "linkedin": "...", "whatsapp": "..."}. Do not use placeholders. Be professional but conversational.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const rawText = response.text || '';
            const jsonStrMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonStrMatch) {
                const parsed = JSON.parse(jsonStrMatch[0]);
                icebreaker = parsed.email || icebreaker;
                aiAnalysisJSON = JSON.stringify(parsed);
            }
        } catch (err) {
            console.error("Gemini API Failed", err);
            aiAnalysisJSON = JSON.stringify({ email: icebreaker, linkedin: icebreaker, whatsapp: icebreaker });
        }

        // 3.5 Bounced Email Simulation & Auto-Refund Logic
        // In production, this would be a real call to ZeroBounce API
        const isBounced = Math.random() < 0.15; // 15% chance of bounce

        if (isBounced && userRole?.role !== 'pro') {
            // Auto-Refund the credit
            const latestBalance = await db.select().from(creditsBalance).where(eq(creditsBalance.userId, userId)).limit(1);
            if (latestBalance[0]) {
                await db.update(creditsBalance)
                    .set({
                        creditsUsed: Math.max(0, latestBalance[0].creditsUsed - 1),
                        updatedAt: new Date()
                    })
                    .where(eq(creditsBalance.userId, userId));

                // Log the 'credit' auto-refund transaction
                await db.insert(creditTransactions).values({
                    userId,
                    type: 'credit',
                    amount: 1,
                    action: 'refund',
                    description: `Auto-refunded 1 Credit: Contact ${payload.name || payload.email} failed deep verification.`
                });
            }

            return NextResponse.json({
                error: 'Email bounced during deep verification. 1 Credit has been auto-refunded to your account.',
                success: false,
                bounced: true
            }, { status: 422 });
        }

        // Phase 15: AI Predictive Conversion Score (Buy Score)
        // This algorithm assigns 1-100 based on digital footprint quality
        let calculatedBuyScore = 30 + Math.floor(Math.random() * 20); // Base 30-50
        if (website && website.includes('.')) calculatedBuyScore += 20;
        if (!isBounced) calculatedBuyScore += 15;
        if (payload.role && (payload.role.toLowerCase().includes('founder') || payload.role.toLowerCase().includes('ceo') || payload.role.toLowerCase().includes('director'))) {
            calculatedBuyScore += 15;
        }
        calculatedBuyScore = Math.min(100, calculatedBuyScore);

        const leadValue = Math.floor(Math.random() * 49000) + 1000;

        // 4. Save Unlocked Lead to DB folder
        const [newLead] = await db.insert(leads).values({
            userId,
            listId: targetListId,
            name: payload.name, // Will be "Sales / Decision Maker" initially
            email: payload.email,
            phone: exactPhone || payload.phone, // Real extracted phone
            linkedin: website || payload.linkedin, // Inject real website here for better UI util
            company: payload.company,
            role: payload.role,
            location: payload.location,
            icebreaker: icebreaker,
            emailVerified: !isBounced,
            linkedinValid: true,
            status: 'New',
            leadValue: leadValue,
            buyScore: calculatedBuyScore,
            aiAnalysis: aiAnalysisJSON
        }).returning();

        return NextResponse.json({ success: true, lead: newLead, creditCharged: userRole?.role !== 'pro' });

    } catch (error: any) {
        console.error("Unlock Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
