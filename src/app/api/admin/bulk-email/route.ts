import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { sendTransactionalEmail } from '@/lib/brevo';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.email !== 'info@aiclex.co.in') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userIds, subject, body } = await req.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'No recipients selected' }, { status: 400 });
        }

        if (!subject || !body) {
            return NextResponse.json({ error: 'Subject and Body are required' }, { status: 400 });
        }

        // Fetch user emails and names
        const recipients = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
        })
        .from(users)
        .where(inArray(users.id, userIds));

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'Recipients not found' }, { status: 404 });
        }

        let successCount = 0;
        let failCount = 0;

        // Send emails sequentially to avoid hitting SMTP rate limits too hard (or use Promise.all for smaller batches)
        for (const recipient of recipients) {
            const personalizedBody = body.replace(/\{name\}/g, recipient.name || 'User');
            
            // Wrap in basic template
            const htmlContent = `
                <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; color: #1e293b; border: 1px solid #e2e8f0;">
                    <div style="margin-bottom: 30px;">
                        <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">DhandaLeads</h1>
                    </div>
                    <div style="font-size: 16px; line-height: 1.6;">
                        ${personalizedBody.replace(/\n/g, '<br/>')}
                    </div>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="color: #64748b; font-size: 12px;">© ${new Date().getFullYear()} DhandaLeads Infrastructure. India's #1 B2B Data Engine.</p>
                        <p style="color: #94a3b8; font-size: 10px; margin-top: 10px;">You are receiving this because you registered on dhandaleads.com</p>
                    </div>
                </div>
            `;

            const success = await sendTransactionalEmail({
                to: [{ email: recipient.email, name: recipient.name || undefined }],
                subject: subject,
                htmlContent: htmlContent,
                senderName: 'DhandaLeads Growth Team'
            });

            if (success) successCount++;
            else failCount++;
        }

        return NextResponse.json({ 
            success: true, 
            message: `Bulk email process completed. Sent: ${successCount}, Failed: ${failCount}`,
            summary: { successCount, failCount }
        });

    } catch (error: any) {
        console.error("Bulk Email Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
