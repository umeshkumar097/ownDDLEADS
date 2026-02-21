'use client';

import { Activity } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { load } from '@cashfreepayments/cashfree-js';

export default function PricingClientAdapter({ plans }: { plans: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isWelcomeOffer = searchParams.get('welcome_offer') === 'true';

    const handleSubscribe = async (creditAmount: number, priceInCents: number, name: string) => {
        const toastId = toast.loading('Initializing Secure Checkout...');
        const sourceCity = localStorage.getItem('dhanda_sourceCity');
        const sourceKeyword = localStorage.getItem('dhanda_sourceKeyword');

        try {
            const res = await fetch('/api/checkout/cashfree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creditAmount, priceInCents, name, sourceCity, sourceKeyword })
            });
            if (res.status === 401) {
                toast.error('Please log in to purchase credits', { id: toastId, style: { background: '#333', color: '#fff' } });
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (data.payment_session_id) {
                toast.success('Gateway secured. Redirecting...', { id: toastId });
                const cashfree = await load({
                    mode: "production"
                });

                await cashfree.checkout({
                    paymentSessionId: data.payment_session_id,
                    redirectTarget: "_self", // or "_modal" for popup
                });
            } else {
                throw new Error(data.error || "Could not generate Cashfree session");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Payment initiation failed', { id: toastId, style: { background: '#333', color: '#fff' } });
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl justify-center items-stretch mb-12">
                {plans.map((plan) => {
                    // Decide styling based on popularity
                    const isPopular = plan.isPopular;
                    const cardBase = isPopular
                        ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/40 rounded-3xl p-8 w-full relative flex flex-col items-center text-center shadow-[0_0_50px_rgba(79,70,229,0.3)] transform md:-translate-y-4"
                        : "bg-black/40 border border-white/10 rounded-3xl p-8 w-full flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/50 hover:-translate-y-1";

                    const priceText = isPopular ? "text-white" : "text-slate-300";
                    const creditsBg = isPopular
                        ? "text-white font-black text-2xl mb-6 bg-indigo-600 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                        : "text-indigo-400 font-bold text-xl mb-6 bg-indigo-500/10 px-6 py-2 rounded-full";

                    const btnClass = isPopular
                        ? "w-full bg-white text-indigo-950 hover:bg-slate-200 font-bold mt-auto py-4 rounded-xl transition-all shadow-lg"
                        : "w-full bg-slate-800 text-white hover:bg-slate-700 font-bold mt-auto py-4 rounded-xl transition-all";

                    return (
                        <div key={plan.id} className={cardBase}>
                            {isPopular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl shadow-lg">Most Popular</div>
                            )}

                            <h2 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-300'}`}>{plan.planName}</h2>
                            <div className={`text-5xl font-black mb-2 ${isPopular ? 'text-white' : 'text-slate-100'}`}>
                                {isWelcomeOffer && plan.priceInINR === 499 ? (
                                    <>
                                        <span className="text-3xl text-slate-500 line-through mr-3">₹{plan.priceInINR.toLocaleString()}</span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                            ₹{Math.floor(plan.priceInINR * 0.5).toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    `₹${plan.priceInINR.toLocaleString()}`
                                )}
                            </div>
                            <p className={`text-sm mb-8 ${isPopular ? 'text-indigo-300' : 'text-slate-500'}`}>
                                {isPopular ? "Best value for growing agencies" : "Scalable outreach infrastructure"}
                            </p>

                            <div className={creditsBg}>
                                {plan.creditsAwarded} Credits
                            </div>

                            <ul className={`space-y-4 mb-10 text-left w-full mx-auto max-w-[200px] flex-grow ${isPopular ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                                {plan.features && plan.features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <span className="text-emerald-400 font-bold">+</span> {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.creditsAwarded, plan.priceInINR * 100, `${plan.planName} (${plan.creditsAwarded} Credits)`)}
                                className={btnClass}
                            >
                                {isWelcomeOffer && plan.priceInINR === 499 ? 'Claim 50% Off Now' : 'Buy Now'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <button onClick={() => router.push('/dashboard')} className="mb-20 text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                ← Return to Dashboard
            </button>
        </div>
    );
}
