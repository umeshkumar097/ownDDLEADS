'use client';

import { Activity, X, Building2, FileText, MapPin, ReceiptText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { load } from '@cashfreepayments/cashfree-js';
import { trackEvent } from '@/lib/tracking';

type PlanArgs = {
    creditAmount: number;
    priceInCents: number;
    name: string;
    subtotalInr: number;
    gstInr: number;
    totalInr: number;
};

export default function PricingClientAdapter({ plans }: { plans: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isWelcomeOffer = searchParams.get('welcome_offer') === 'true';

    // Modal State
    const [selectedPlan, setSelectedPlan] = useState<PlanArgs | null>(null);
    const [showGstDetails, setShowGstDetails] = useState(false);

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('visited_pricing', 'true');
        }
    }, []);

    const openCheckoutModal = (creditAmount: number, priceInCents: number, name: string) => {
        const subtotalInr = priceInCents / 100;
        const gstInr = subtotalInr * 0.18;
        const totalInr = subtotalInr + gstInr;

        setSelectedPlan({
            creditAmount,
            priceInCents,
            name,
            subtotalInr,
            gstInr,
            totalInr
        });

        // Reset form slightly just in case
        setShowGstDetails(false);
    };

    const confirmCheckout = async () => {
        if (!selectedPlan) return;

        const toastId = toast.loading('Initializing Secure Checkout...');
        const sourceCity = localStorage.getItem('dhanda_sourceCity');
        const sourceKeyword = localStorage.getItem('dhanda_sourceKeyword');

        try {
            const payload = {
                creditAmount: selectedPlan.creditAmount,
                priceInCents: selectedPlan.priceInCents,
                name: selectedPlan.name,
                sourceCity,
                sourceKeyword,
                companyName: showGstDetails ? companyName : undefined,
                gstNumber: showGstDetails ? gstNumber : undefined,
                billingAddress: showGstDetails ? billingAddress : undefined,
            };

            const res = await fetch('/api/checkout/cashfree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                toast.error('Please log in to purchase credits', { id: toastId, style: { background: '#333', color: '#fff' } });
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (data.payment_session_id) {
                trackEvent('Payment_Initiated', {
                    currency: 'INR',
                    value: selectedPlan.priceInCents / 100,
                    plan: selectedPlan.name
                });
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl justify-center items-stretch mb-12 relative z-0">
                {plans.map((plan) => {
                    const isPopular = plan.isPopular;
                    const cardBase = isPopular
                        ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/40 rounded-3xl p-8 w-full relative flex flex-col items-center text-center shadow-[0_0_50px_rgba(79,70,229,0.3)] transform md:-translate-y-4"
                        : "bg-black/40 border border-white/10 rounded-3xl p-8 w-full flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/50 hover:-translate-y-1";

                    const creditsBg = isPopular
                        ? "text-white font-black text-2xl mb-6 bg-indigo-600 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                        : "text-indigo-400 font-bold text-xl mb-6 bg-indigo-500/10 px-6 py-2 rounded-full";

                    const btnClass = isPopular
                        ? "w-full bg-white text-indigo-950 hover:bg-slate-200 font-bold mt-auto py-4 rounded-xl transition-all shadow-lg"
                        : "w-full bg-slate-800 text-white hover:bg-slate-700 font-bold mt-auto py-4 rounded-xl transition-all";

                    // Determine actual price and labels based on Welcome Offer
                    let displayPrice = plan.priceInINR.toLocaleString();
                    let strikePrice = null;
                    let actualCheckoutPrice = plan.priceInINR * 100; // in cents
                    let btnText = "Buy Now";

                    if (isWelcomeOffer && plan.priceInINR === 499) {
                        actualCheckoutPrice = 24900; // Passes explicitly 24900 to Cashfree (₹249)
                        displayPrice = "249";
                        strikePrice = "499";
                        btnText = "Claim ₹249 Full Pack";
                    }

                    return (
                        <div key={plan.id} className={cardBase}>
                            {isPopular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl shadow-lg">Most Popular</div>
                            )}

                            <h2 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-300'}`}>{plan.planName}</h2>
                            <div className={`text-5xl font-black mb-2 ${isPopular ? 'text-white' : 'text-slate-100'}`}>
                                {strikePrice ? (
                                    <>
                                        <span className="text-3xl text-slate-500 line-through mr-3">₹{strikePrice}</span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                            ₹{displayPrice}
                                        </span>
                                    </>
                                ) : (
                                    `₹${displayPrice}`
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
                                onClick={() => openCheckoutModal(plan.creditsAwarded, actualCheckoutPrice, `${plan.planName} (${plan.creditsAwarded} Credits)`)}
                                className={btnClass}
                            >
                                {btnText}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* GST Summary Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <ReceiptText className="w-5 h-5 text-indigo-400" /> Secure Checkout
                            </h3>
                            <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <h4 className="text-slate-300 font-semibold mb-4 text-center">{selectedPlan.name}</h4>

                            <div className="bg-black/50 rounded-xl p-4 space-y-3 mb-6 font-mono text-sm border border-white/5">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span>Subtotal</span>
                                    <span>₹{selectedPlan.subtotalInr.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>GST (18%)</span>
                                    <span>+ ₹{selectedPlan.gstInr.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-white font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span className="text-emerald-400">₹{selectedPlan.totalInr.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={showGstDetails}
                                        onChange={(e) => setShowGstDetails(e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                    />
                                    <span>I want to claim GST Input Tax Credit</span>
                                </label>
                            </div>

                            {showGstDetails && (
                                <div className="space-y-4 mb-6 animate-in slide-in-from-top-2">
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Company Name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="GST Number (optional)"
                                            value={gstNumber}
                                            onChange={(e) => setGstNumber(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                        <textarea
                                            placeholder="Billing Address"
                                            value={billingAddress}
                                            onChange={(e) => setBillingAddress(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={confirmCheckout}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                            >
                                Proceed to Pay ₹{selectedPlan.totalInr.toFixed(2)}
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-4">Payments processed securely via Cashfree Gateway.</p>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => router.push('/dashboard')} className="mb-20 text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-2 relative z-0">
                ← Return to Dashboard
            </button>
        </div>
    );
}
