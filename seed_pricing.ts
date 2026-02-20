import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { db } from './src/db';
import { pricingPlans } from './src/db/schema';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

async function main() {
    console.log("Environment DATABASE_URL Loaded:", process.env.DATABASE_URL ? "YES" : "NO");
    console.log("Seeding default pricing plans...");
    
    try {
        await db.insert(pricingPlans).values([
            {
                planName: 'Starter Pack',
                priceInINR: 999,
                creditsAwarded: 100,
                isPopular: false,
                features: ['Never expires', 'Auto-Refund on bounce', 'AI Email Icebreakers']
            },
            {
                planName: 'Growth Pack',
                priceInINR: 3999,
                creditsAwarded: 500,
                isPopular: true,
                features: ['Never expires', 'Auto-Refund on bounce', 'AI Email Icebreakers', 'Priority Support']
            },
            {
                planName: 'Scale Pack',
                priceInINR: 6999,
                creditsAwarded: 1000,
                isPopular: false,
                features: ['Never expires', 'Auto-Refund on bounce', 'AI Email Icebreakers', 'CSV Batch Export']
            }
        ]).onConflictDoNothing({ target: pricingPlans.planName });
        
        console.log("Pricing seeded successfully!");
        
        const plans = await db.query.pricingPlans.findMany();
        console.log("Current DB Record Count:", plans.length);
    } catch (e) {
        console.error("Failed:", e);
    }
    process.exit(0);
}

main();
