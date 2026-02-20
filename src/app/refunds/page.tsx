'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RefundsPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 prose prose-invert prose-indigo">
                <h1 className="text-4xl font-black mb-8">Refund & Cancellation Policy</h1>
                <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Cancellations</h2>
                    <p className="text-slate-300">
                        As DhandaLeads (Aiclex Technologies) operates on a pre-paid Credit system rather than a recurring subscription model, you have full control over your spending. You may choose to stop purchasing credits or using our service at any time. There are no long-term contracts or mandatory recurring billing cycles to cancel.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Refunds on Credit Purchases</h2>
                    <p className="text-slate-300">
                        All sales of Lead Credits are considered final. We do not offer refunds for unused credits that have been added to your wallet. We highly recommend testing the platform with our free introductory credits before making a large purchase.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Exceptional Circumstances</h2>
                    <p className="text-slate-300">
                        If there has been a technical error related to the payment gateway (e.g., duplicate charges), a refund may be issued at our sole discretion. To request a review of your transaction, please contact us within 7 days of the billing event.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Bounced Lead Credits</h2>
                    <p className="text-slate-300">
                        Our system utilizes zero-bounce validation. If a lead you unlock bounces during deep verification, our system is designed to automatically refund that specific 1 Credit back to your wallet balance. This is an automated platform feature, not a monetary refund.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Contact</h2>
                    <p className="text-slate-300">
                        For any queries related to billing or refunds, email us at: <a href="mailto:info@aiclex.in" className="text-indigo-400">info@aiclex.in</a>
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
}
