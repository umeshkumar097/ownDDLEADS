import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { db } from './src/db';

async function main() {
    const plans = await db.query.pricingPlans.findMany();
    console.log(JSON.stringify(plans, null, 2));
    process.exit(0);
}

main().catch(console.error);
