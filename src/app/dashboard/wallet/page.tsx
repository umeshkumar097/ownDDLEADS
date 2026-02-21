import { db } from '@/db';
import WalletClient from './WalletClient';

export default async function WalletPage() {
    // Fetch dynamic pricing directly from Postgres to render inside the wallet
    const plans = await db.query.pricingPlans.findMany({
        orderBy: (pricingPlans, { asc }) => [asc(pricingPlans.priceInINR)]
    });

    return <WalletClient plans={plans} />;
}
