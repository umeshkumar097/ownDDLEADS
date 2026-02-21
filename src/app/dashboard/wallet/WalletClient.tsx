'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CreditCard, History, ArrowUpRight, ArrowDownRight, Wallet, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { load } from '@cashfreepayments/cashfree-js';

interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    action: string;
    description: string | null;
    createdAt: string;
}

export default function WalletClient({ plans }: { plans: any[] }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'usage' | 'purchase'>('usage');
    const [showPricing, setShowPricing] = useState(false);

    const handleSubscribe = async (creditAmount: number, priceInCents: number, name: string) => {
        const toastId = toast.loading('Initializing Secure Checkout...');
        try {
            const res = await fetch('/api/checkout/cashfree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creditAmount, priceInCents, name })
            });
            if (res.status === 401) {
                toast.error('Session expired. Please log in again.', { id: toastId });
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (data.payment_session_id) {
                toast.success('Gateway secured. Redirecting...', { id: toastId });
                const cashfree = await load({ mode: "production" }); // Used production explicitly for Wallet

                await cashfree.checkout({
                    paymentSessionId: data.payment_session_id,
                    redirectTarget: "_self",
                });
            } else {
                throw new Error(data.error || "Could not generate Cashfree session");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Payment initiation failed', { id: toastId });
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetchHistory();
        }
    }, [session]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/wallet/history');
            if (!res.ok) throw new Error('Failed to fetch history');
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transaction history:', error);
            toast.error('Failed to load wallet history', { style: { background: '#333', color: '#fff' } });
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const displayedTransactions = transactions.filter(t => activeTab === 'usage' ? t.type === 'debit' : t.type === 'credit');

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-10 ml-0 md:ml-64 selection:bg-indigo-500/30">
            <Toaster position="bottom-right" />

            <div className="max-w-6xl mx-auto space-y-8 mt-16 md:mt-0">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-indigo-400" /> Wallet & Billing
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your credit balance, view transaction history, and load new credits.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current Balance Card */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                            <h2 className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-400" /> Available Balance
                            </h2>
                            <div className="mt-4 flex items-baseline gap-4">
                                <span className="text-6xl md:text-7xl font-black text-white">{(session?.user as any)?.creditsBalance || 0}</span>
                                <span className="text-xl text-indigo-300 font-medium">Credits</span>
                            </div>

                            {((session?.user as any)?.creditsBalance || 0) < 10 ? (
                                <div className="mt-8">
                                    <button onClick={() => setShowPricing(true)} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(225,29,72,0.6)] animate-pulse">
                                        Low Credits! Buy Now to Keep Scaling <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <button onClick={() => setShowPricing(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25">
                                        Load Credits <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats or Promo Card */}
                    <div className="col-span-1 border border-white/5 bg-black/40 rounded-3xl p-8 flex flex-col justify-center">
                        <h3 className="font-bold text-slate-300 mb-4">How it works</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3"><div className="text-emerald-400 mt-0.5">•</div> 1 Credit = 1 Verified Lead unlocked.</li>
                            <li className="flex gap-3"><div className="text-emerald-400 mt-0.5">•</div> Free searches do not consume credits.</li>
                            <li className="flex gap-3"><div className="text-emerald-400 mt-0.5">•</div> Credits never expire.</li>
                            <li className="flex gap-3"><div className="text-emerald-400 mt-0.5">•</div> Auto-refund issued if a lead bounces.</li>
                        </ul>
                    </div>
                </div>

                {/* Inline Pricing Plans UI */}
                {showPricing && (
                    <div className="bg-black/40 border border-indigo-500/30 rounded-3xl p-8 mt-12 mb-12 relative overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white">Select a Credit Package</h2>
                                <p className="text-slate-400 mt-2">1 Credit = 1 Verified Lead. Credits never expire.</p>
                            </div>
                            <button onClick={() => setShowPricing(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-all">Close</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => {
                                const isPopular = plan.isPopular;
                                return (
                                    <div key={plan.id} className={`relative p-6 rounded-2xl flex flex-col border ${isPopular ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'bg-slate-900/50 border-white/10 hover:border-indigo-500/50 transition-all'}`}>
                                        {isPopular && <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Popular</div>}
                                        <h3 className={`text-xl font-bold mb-1 ${isPopular ? 'text-white' : 'text-slate-300'}`}>{plan.planName}</h3>
                                        <div className={`text-4xl font-black mb-4 ${isPopular ? 'text-white' : 'text-slate-100'}`}>₹{plan.priceInINR.toLocaleString()}</div>
                                        <div className={`inline-block px-4 py-1.5 rounded-full font-bold text-lg w-max mb-6 ${isPopular ? 'bg-indigo-600 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                            {plan.creditsAwarded} Credits
                                        </div>
                                        <div className="mt-auto pt-6">
                                            <button
                                                onClick={() => handleSubscribe(plan.creditsAwarded, plan.priceInINR * 100, `${plan.planName} (${plan.creditsAwarded} Credits)`)}
                                                className={`w-full py-3 rounded-xl font-bold transition-all ${isPopular ? 'bg-white text-indigo-950 hover:bg-slate-200 shadow-md' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                                            >
                                                Proceed to Pay
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden mt-12">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <History className="w-6 h-6 text-indigo-400" /> Transaction History
                        </h2>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('usage')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'usage' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Usage Log
                            </button>
                            <button
                                onClick={() => setActiveTab('purchase')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'purchase' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Purchase History
                            </button>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No transactions found.</p>
                            <p className="text-sm mt-2">Your credit purchases and usage logs will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02]">
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500 w-48">Date & Time</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Description</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500 w-32">Type</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500 text-right w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {displayedTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-6 text-sm text-slate-400 whitespace-nowrap">
                                                {format(new Date(t.createdAt), 'MMM dd, yyyy HH:mm')}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-slate-300">{t.action.replace(/_/g, ' ').toUpperCase()}</div>
                                                {t.description && <div className="text-xs text-slate-500 mt-1">{t.description}</div>}
                                            </td>
                                            <td className="py-4 px-6">
                                                {t.type === 'credit' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <ArrowDownRight className="w-3 h-3" /> Credit
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        <ArrowUpRight className="w-3 h-3" /> Debit
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right font-mono font-bold">
                                                {t.type === 'credit' ? (
                                                    <span className="text-emerald-400">+{t.amount}</span>
                                                ) : (
                                                    <span className="text-rose-400">-{t.amount}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
