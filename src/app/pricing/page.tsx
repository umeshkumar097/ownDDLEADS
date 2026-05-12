import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingClientAdapter from './PricingClientAdapter';
import { db } from '@/db';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic'; // Always render at request time, not build time

export default async function PricingPage() {
    // Fetch dynamic pricing straight from Postgres Supabase
    const plans = await db.query.pricingPlans.findMany({
        orderBy: (pricingPlans, { asc }) => [asc(pricingPlans.priceInINR)]
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
            <Navbar />

            <div className="flex flex-col items-center mb-16 mt-20">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Load Your CRM Wallet</h1>
                <p className="text-slate-400 text-lg text-center max-w-xl">No subscriptions. No hidden fees. Buy verified leads as you need them. 1.5 Credits = 1 Verified Lead.</p>
            </div>

            {/* Client Component passing Server Data */}
            <Suspense fallback={<div className="text-center text-slate-500 py-10">Loading plans...</div>}>
                <PricingClientAdapter plans={plans} />
            </Suspense>

            <Footer />
        </div>
    );
}
