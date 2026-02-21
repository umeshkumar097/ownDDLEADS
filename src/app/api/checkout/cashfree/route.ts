import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { users, allTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { creditAmount, priceInCents, name, sourceCity, sourceKeyword, targetCurrency } = body;

        const currency = targetCurrency || 'INR';
        let amount = priceInCents / 100;

        // Auto-Calculate 18% GST for Indian Transactions
        // In real environments, sourceCountry would be detected via headers/IP
        const applyTax = currency === 'INR';
        let taxAmount = 0;

        if (applyTax) {
            taxAmount = amount * 0.18;
            amount = amount + taxAmount;
        }

        const formattedAmount = amount.toFixed(2);

        // Fetch User Contact Data
        const liveUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id as string)
        });

        if (!liveUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // Cashfree Production Enforces strict whitelisted domains. 
        // Bypassing Localhost by masquerading as the whitelisted dhandaleads.com domain.
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
        const isLocalhost = baseUrl.includes('localhost');
        const secureBaseUrl = isLocalhost ? 'https://dhandaleads.com' : baseUrl;

        const payload = {
            order_amount: parseFloat(formattedAmount),
            order_currency: currency,
            order_id: orderId,
            customer_details: {
                customer_id: liveUser.id.substring(0, 40), // Cashfree max length limit
                customer_name: liveUser.name?.substring(0, 100) || "Customer",
                customer_email: liveUser.email,
                customer_phone: liveUser.phone || "9999999999" // Provide dummy if missing, cashfree enforces 10 digits
            },
            order_meta: {
                // If localhost, we use dhandaleads.com to bypass the Cashfree popup block.
                // Upon payment success on localhost, it will redirect you to the live site.
                return_url: `${secureBaseUrl}/dashboard/wallet?order_id={order_id}&status={order_status}`,
                notify_url: `${secureBaseUrl}/api/webhooks/cashfree`
            },
            order_tags: {
                credits: creditAmount.toString(),
                userId: liveUser.id,
                planName: name,
                sourceCity: sourceCity || "",
                sourceKeyword: sourceKeyword || "",
                taxApplied: taxAmount.toFixed(2)
            }
        };

        const response = await fetch('https://api.cashfree.com/pg/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_APP_ID as string,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY as string,
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Cashfree Order Create Error:", data);
            return NextResponse.json({ error: 'Failed to create Cashfree order', details: data }, { status: 400 });
        }

        // Phase 14: Log PENDING checkout for abandoned cart recovery
        await db.insert(allTransactions).values({
            userId: liveUser.id,
            amount: parseFloat(formattedAmount).toString(),
            creditsAdded: creditAmount,
            gatewayTxnId: orderId, // Store our local orderId temporarily
            status: 'PENDING',
            sourceCity: sourceCity || null,
            sourceKeyword: sourceKeyword || null
        });

        return NextResponse.json({ payment_session_id: data.payment_session_id, order_id: orderId });

    } catch (e: any) {
        console.error("Cashfree Route Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
