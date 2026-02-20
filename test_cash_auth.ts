import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

async function main() {
    const amountInINR = (99900 / 100).toFixed(2);
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    console.log("Using APP ID:", process.env.CASHFREE_APP_ID);

    const payload = {
        order_amount: parseFloat(amountInINR),
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: "test_user_12345",
            customer_name: "Test User",
            customer_email: "test@example.com",
            customer_phone: "9999999999"
        },
        order_meta: {
            return_url: `http://localhost:3001/dashboard/wallet?order_id={order_id}&status={order_status}`,
            notify_url: `http://localhost:3001/api/webhooks/cashfree`
        },
        order_tags: {
            credits: "100",
            userId: "test_user_12345",
            planName: "Starter Pack"
        }
    };

    try {
        const response2 = await fetch('https://api.cashfree.com/pg/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_APP_ID as string,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY as string,
            },
            body: JSON.stringify(payload)
        });

        const data2 = await response2.json();
        console.log("PROD Cashfree Response:", JSON.stringify(data2, null, 2));
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

main();
