import { db } from '@/db';
import { emailLogs } from '@/db/schema';
import nodemailer from 'nodemailer';

export async function sendTransactionalEmail({
    to,
    subject,
    htmlContent,
    senderName = 'DhandaLeads Team',
}: {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    senderName?: string;
}) {
    const BREVO_LOGIN = process.env.BREVO_SMTP_LOGIN || '9fbca6001@smtp-brevo.com'; // Fallback to provided defaults if missing
    const BREVO_PASSWORD = process.env.BREVO_API_KEY; // API keys act as SMTP passwords in Brevo
    const SENDER_EMAIL = 'no-reply@dhandaleads.com';

    if (!BREVO_PASSWORD) {
        console.error('Missing BREVO_API_KEY / SMTP Password in environment variables.');
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: BREVO_LOGIN,
                pass: BREVO_PASSWORD,
            },
        });

        const toAddresses = to.map(t => t.name ? `${t.name} <${t.email}>` : t.email).join(', ');

        const info = await transporter.sendMail({
            from: `"${senderName}" <${SENDER_EMAIL}>`,
            to: toAddresses,
            subject: subject,
            html: htmlContent,
        });

        // Log Success
        for (const recipient of to) {
            await db.insert(emailLogs).values({
                recipientEmail: recipient.email,
                subject: subject,
                status: 'sent',
                errorDetails: info.messageId
            }).catch(e => console.error("Could not write email success log:", e));
        }

        return true;
    } catch (error: any) {
        console.error('Failed to send email via Brevo SMTP:', error);

        // Log Critical Exception
        for (const recipient of to) {
            await db.insert(emailLogs).values({
                recipientEmail: recipient.email,
                subject: subject,
                status: 'failed',
                errorDetails: error?.message || 'Unknown SMTP error'
            }).catch(e => console.error("Could not write email failure log:", e));
        }

        return false;
    }
}

// -----------------------------------------------------------------------------
// Pre-defined Email Templates
// -----------------------------------------------------------------------------

export async function sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify/${token}`;

    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px; letter-spacing: -0.5px;">DhandaLeads</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">The B2B Data Engine</p>
            </div>
            <h2 style="color: #f1f5f9; font-size: 22px;">Welcome aboard, ${name}! 🚀</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">You're just one step away from unlocking ultra high-quality B2B leads. Please verify your email address to activate your account securely.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" style="background-color: #10b981; color: #022c22; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);">Verify Email Address</a>
            </div>
            <p style="color: #64748b; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${verificationUrl}" style="color: #38bdf8; text-decoration: none; margin-top: 8px; display: inline-block; word-break: break-all;">${verificationUrl}</a>
            </p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; font-size: 12px;">© ${new Date().getFullYear()} Aiclex Technologies. Building for India.</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email, name }],
        subject: 'Action Required: Verify your DhandaLeads Account',
        htmlContent,
    });
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #818cf8; margin: 0; font-size: 28px; letter-spacing: -0.5px;">DhandaLeads</h1>
            </div>
            <h2 style="color: #f1f5f9; font-size: 22px;">Security Protocol 🔐</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">We received a verified request to reset the password for your DhandaLeads Admin/User account associated with this email address.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);">Authorize Password Reset</a>
            </div>
            <p style="color: #64748b; font-size: 13px;">If you didn't initiate this request, your account is still secure. You can safely ignore this automated message.</p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; font-size: 12px;">Secure Transmission by DhandaLeads Infrastructure</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email }],
        subject: 'Security: Reset your DhandaLeads Password',
        htmlContent,
    });
}

export async function sendLowCreditAlertEmail(email: string, name: string, remainingCredits: number) {
    const rechargeUrl = `${process.env.NEXTAUTH_URL}/dashboard/wallet`;

    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #e11d48;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #e11d48; margin: 0; font-size: 28px; letter-spacing: -0.5px;">DhandaLeads Vault</h1>
            </div>
            <h2 style="color: #f1f5f9; font-size: 22px;">Low Credit Alert ⚠️</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Hi ${name}, your B2B data extraction pipeline is about to halt. You currently have <strong style="color: #fb7185; font-size: 18px;">only ${remainingCredits} credits remaining.</strong></p>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Don't let your sales team stop prospecting! Top up your wallet now to keep generating high-conversion leads.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${rechargeUrl}" style="background-color: #e11d48; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(225, 29, 72, 0.39);">Recharge Credits Now</a>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; font-size: 12px;">Automated God-Eye Alert System</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email, name }],
        subject: 'URGENT: Your DhandaLeads Credits are Running Out',
        htmlContent,
    });
}

export async function sendPurchaseConfirmationEmail(email: string, name: string, creditsAdded: number, amountPaid: number) {
    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px; letter-spacing: -0.5px;">DhandaLeads Billing</h1>
            </div>
            <h2 style="color: #f1f5f9; font-size: 22px;">Payment Processed! 💸</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Hi ${name}, we successfully received your secure payment of <strong style="color: #10b981;">₹${amountPaid}</strong>.</p>
            
            <div style="background-color: #1e293b; border-radius: 12px; padding: 24px; margin: 32px 0; text-align: center; border: 1px solid #334155;">
                <span style="font-size: 42px; font-weight: 900; color: #34d399;">+${creditsAdded}</span>
                <p style="color: #94a3b8; font-weight: 800; margin-top: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Credits Deployed to Wallet</p>
            </div>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">You can use these tokens instantly to slice through bulk datasets and find premium phone numbers and emails. Thank you for scaling your enterprise with us.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/wallet" style="background-color: #10b981; color: #022c22; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);">Access Ledger</a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; font-size: 12px;">This is an automated tax invoice and receipt.</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email, name }],
        subject: `Receipt: ${creditsAdded} Premium Leads Added to your Wallet`,
        htmlContent,
    });
}

export async function sendAdminNewUserAlert(userData: { name: string; email: string; phone: string }) {
    const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">New User Registration Alert 🚨</h2>
            <p>A new user has just registered on <strong>DhandaLeads</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">Name:</td>
                    <td style="padding: 10px; border: 1px solid #eee;">${userData.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">Email:</td>
                    <td style="padding: 10px; border: 1px solid #eee;">${userData.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px; border: 1px solid #eee;">${userData.phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">Time:</td>
                    <td style="padding: 10px; border: 1px solid #eee;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated alert from DhandaLeads Infrastructure.</p>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email: 'info@aiclex.co.in', name: 'Admin' }],
        subject: `New User Joined: ${userData.name} (${userData.email})`,
        htmlContent,
        senderName: 'DhandaLeads Alerts'
    });
}

export async function sendBonusCreditsEmail(email: string, name: string, creditsAdded: number) {
    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 16px; color: #f8fafc; border: 1px solid #818cf8; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #818cf8; margin: 0; font-size: 28px; letter-spacing: -0.5px;">DhandaLeads Reward</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">Exclusive Member Gift</p>
            </div>

            <h2 style="color: #f1f5f9; font-size: 22px; text-align: center;">Surprise! You've received a gift 🎁</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center;">Hi ${name}, we've just topped up your wallet with some bonus credits to help you accelerate your lead generation journey.</p>
            
            <div style="background-color: rgba(129, 140, 248, 0.1); border: 2px dashed #818cf8; border-radius: 20px; padding: 32px; margin: 32px 0; text-align: center;">
                <div style="color: #818cf8; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px;">Credits Unlocked</div>
                <span style="font-size: 54px; font-weight: 900; color: #ffffff; text-shadow: 0 0 20px rgba(129, 140, 248, 0.4);">+${creditsAdded}</span>
                <p style="color: #94a3b8; margin-top: 12px; font-size: 14px; font-weight: 600;">Valid for Premium B2B Extractions</p>
            </div>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center;">These credits are now active in your account. You can start using them immediately to discover high-value prospects.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #818cf8; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 24px rgba(129, 140, 248, 0.3);">Go to Dashboard</a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; font-size: 12px;">This is a complimentary reward from DhandaLeads Administration.</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email, name }],
        subject: `🎁 Surprise: We just added ${creditsAdded} bonus credits to your wallet!`,
        htmlContent,
    });
}

export async function sendWalletUpdateEmail({
    email,
    name,
    amount,
    type,
    reason,
    newBalance
}: {
    email: string;
    name: string;
    amount: number;
    type: 'credit' | 'debit';
    reason: string;
    newBalance: number;
}) {
    const isCredit = type === 'credit';
    const accentColor = isCredit ? '#10b981' : '#f43f5e';
    const icon = isCredit ? '💰' : '📉';
    const statusText = isCredit ? 'Added to' : 'Deducted from';

    const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; max-w: 600px; margin: 0 auto; background-color: #0b0f19; padding: 40px; border-radius: 24px; color: #f8fafc; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 16px; margin-bottom: 16px;">
                    <span style="font-size: 40px;">${icon}</span>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Wallet Update</h1>
                <p style="color: #94a3b8; font-size: 14px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">DhandaLeads Ledger Notification</p>
            </div>

            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 32px;">
                <p style="color: #94a3b8; margin: 0 0 12px 0; font-size: 14px; font-weight: 500;">Credits ${statusText} Wallet</p>
                <div style="font-size: 48px; font-weight: 900; color: ${accentColor}; margin-bottom: 12px;">
                    ${isCredit ? '+' : '-'}${amount}
                </div>
                <div style="display: inline-block; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 99px; color: #cbd5e1; font-size: 13px; font-weight: 600;">
                    New Balance: ${newBalance} Credits
                </div>
            </div>

            <div style="margin-bottom: 32px;">
                <h3 style="color: #ffffff; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Transaction Reason:</h3>
                <div style="background: rgba(255,255,255,0.03); border-left: 4px solid ${accentColor}; padding: 16px 20px; border-radius: 0 12px 12px 0; color: #94a3b8; font-size: 15px; line-height: 1.6; font-style: italic;">
                    "${reason}"
                </div>
            </div>

            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
                Hi ${name}, this update was performed by the DhandaLeads Administrative Team. If you have any questions regarding this transaction, please reply to this email or contact support.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: ${accentColor}; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">View Wallet Details</a>
            </div>

            <div style="padding-top: 32px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="color: #4b5563; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} DhandaLeads Infrastructure. All rights reserved.</p>
            </div>
        </div>
    `;

    return sendTransactionalEmail({
        to: [{ email, name }],
        subject: `[Wallet Update] ${isCredit ? '+' : '-'}${amount} Credits - DhandaLeads`,
        htmlContent,
    });
}
