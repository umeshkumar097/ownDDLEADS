import { NextResponse } from "next/server";
import { db } from "@/db";
import { adsLeads } from "@/db/schema";
import { sendBrevoEmail } from "@/lib/brevo";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, companyName, sourceCity, sourceKeyword } = body;

        if (!name || !email || !phone) {
            return NextResponse.json({ error: "Name, email, and phone are strictly required." }, { status: 400 });
        }

        // 1. Insert into Database
        await db.insert(adsLeads).values({
            name,
            email,
            phone,
            companyName: companyName || null,
            sourceCity: sourceCity || null,
            sourceKeyword: sourceKeyword || null,
        });

        // 2. Fire Email Notification to Admin
        const adminEmail = "info@aiclex.in";
        const emailSubject = `🚀 High-Intent Ads Lead: ${name} (${companyName || 'Unknown Company'})`;
        const emailBody = `
            <h2>New VIP Lead Captured from Ads</h2>
            <br/>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${companyName || 'Not Provided'}</p>
            <p><strong>Source City:</strong> ${sourceCity || 'Unknown'}</p>
            <p><strong>Source Keyword:</strong> ${sourceKeyword || 'Unknown'}</p>
            <br/>
            <p><i>This lead was generated from the /get-leads-fast dedicated ads landing page. Please follow up immediately.</i></p>
        `;

        // Send email silently in the background (fire and forget)
        sendBrevoEmail({
            to: [{ email: adminEmail, name: "Admin" }],
            subject: emailSubject,
            htmlContent: emailBody
        }).catch(err => console.error("Failed to send Admin Ads Lead notification:", err));

        return NextResponse.json({ success: true, message: "Lead captured successfully" });

    } catch (e: any) {
        console.error("Ads Lead API Error:", e);
        return NextResponse.json({ error: e.message || "Failed to process lead" }, { status: 500 });
    }
}
