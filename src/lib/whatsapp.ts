import { db } from '@/db';
import { automationLogs } from '@/db/schema';

export async function sendWhatsAppMessage(toPhone: string, message: string, messageType: string = 'GENERIC', userId?: string) {
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "EAANPIHaxlO4BQOPfWEQFL0fmivpSB09yb36B84HIt08im5yLv6VsZC2fFFo9xOZBfBl2i7LzSMRDD5UIisK2O5AekJtlhYYMj38xyEkZByipNIP1P7qeIjK2bFA4nrVjaM0G7yvZAIw4ZCptMXc2gdMxaAjiWKEd9z4q758ff9nvpNf3763dJDMpHMiMdXAZDZD";
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "375803518953145";

    // Clean phone number (remove +, spaces, dashes)
    let cleanPhone = toPhone.replace(/\D/g, '');

    // Add 91 if it's missing (assuming Indian region primarily for Dhandaleads)
    if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "text",
                text: {
                    body: message
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('WhatsApp API Error:', err);
            return false;
        }

        if (userId) {
            await db.insert(automationLogs).values({
                userId,
                channel: 'WHATSAPP',
                messageType,
            });
        }

        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return false;
    }
}
