import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leadMagnets } from '@/db/schema';
import { sendTransactionalEmail } from '@/lib/brevo';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, city, keyword } = body;

        if (!email || !city || !keyword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save Lead Magnet to DB
        await db.insert(leadMagnets).values({
            userEmail: email,
            sourceCity: city,
            sourceKeyword: keyword,
            isConverted: false,
        });

        // 2. Send the Brevo Email with the Freebie
        const subject = `Your 10 Free ${keyword} in ${city} 🚀`;
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Hey there!</h2>
            <p>You requested 10 free verified ${keyword} for the <b>${city}</b> region.</p>
            <p>As promised, here is your highly targeted sample data to prove the quality of DhandaLeads:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><i>[Attached/Linked PDF Sample Data Goes Here]</i></p>
                <a href="https://dhandaleads.com/register" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Claim 10 More Free Credits</a>
            </div>
            <p>Ready to unlock thousands more? Login to your DhandaLeads dashboard and start dominating ${city}.</p>
            <p>Best,<br>The Aiclex Team</p>
        </div>
        `;

        await sendTransactionalEmail({
            to: [{ email }],
            subject,
            htmlContent,
        });

        return NextResponse.json({ success: true, message: 'Lead magnet sent successfully.' });
    } catch (error: any) {
        console.error('Lead Magnet API Error:', error);
        return NextResponse.json({ error: 'Failed to process lead magnet' }, { status: 500 });
    }
}
