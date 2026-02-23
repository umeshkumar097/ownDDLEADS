'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Landmark, ArrowRight, IndianRupee, Users, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicPartnershipPage() {
    const [referrals, setReferrals] = useState(10);
    const [avgSpend, setAvgSpend] = useState(1598); // Growth Plan

    const calculateEarnings = () => {
        // 1st purchase: 20%
        const firstPurchaseEarnings = referrals * (avgSpend * 0.20);
        // Assuming 50% buy a second time (5%)
        const secondPurchaseEarnings = (referrals * 0.5) * (avgSpend * 0.05);
        // Assuming 25% buy a third time (1%)
        const thirdPurchaseEarnings = (referrals * 0.25) * (avgSpend * 0.01);

        return Math.floor(firstPurchaseEarnings + secondPurchaseEarnings + thirdPurchaseEarnings);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="px-6 text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wide uppercase mb-6 border border-emerald-200 shadow-sm">
                        <Landmark className="w-4 h-4" /> Real Money Affiliate Program
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
                        Turn your network into a <span className="text-emerald-600 border-b-4 border-emerald-400">Cash Flow Machine.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Introduce businesses to DhandaLeads and earn <strong className="text-slate-900">20% commission</strong> on their first purchase, directly straight to your UPI or Bank.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/pricing" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-xl">
                            Unlock Program Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-sm text-slate-500 sm:w-48 text-left leading-tight py-2 flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 shrink-0 text-emerald-500" />
                            Requires minimum ₹499 spend to activate.
                        </p>
                    </div>
                </section>

                {/* Lifetime Value Engine */}
                <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <h2 className="text-4xl font-bold mb-16">The 3-Tier "Scale & Earn" Engine</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm relative">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">1</div>
                                <h3 className="text-2xl font-bold mt-4 mb-2">20% Payout</h3>
                                <p className="text-emerald-400 font-medium mb-4">On their 1st Purchase</p>
                                <p className="text-slate-400 text-sm">When your referral makes their first data credit purchase, you instantly get 20% of the entire transaction value.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm relative md:translate-y-6">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">2</div>
                                <h3 className="text-2xl font-bold mt-4 mb-2">5% Payout</h3>
                                <p className="text-indigo-400 font-medium mb-4">On their 2nd Purchase</p>
                                <p className="text-slate-400 text-sm">As they scale their business and buy more credits, you earn a 5% commission on their second top-up.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm relative md:translate-y-12">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-500 text-white font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">3</div>
                                <h3 className="text-2xl font-bold mt-4 mb-2">1% Forever</h3>
                                <p className="text-purple-400 font-medium mb-4">On ALL Future Purchases</p>
                                <p className="text-slate-400 text-sm">Build a passive income stream. Every single time they recharge for the lifetime of their account, you get 1%.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profit Calculator */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Profit Calculator</h2>
                            <p className="text-lg text-slate-600">See how much you could earn by introducing serious business owners.</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center">

                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-slate-700 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" /> Active Referrals</label>
                                            <span className="font-bold text-emerald-600">{referrals} Users</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="100"
                                            value={referrals}
                                            onChange={(e) => setReferrals(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-slate-700 flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-600" /> Avg. Plan Purchased</label>
                                            <span className="font-bold text-emerald-600">₹{avgSpend}</span>
                                        </div>
                                        <select
                                            value={avgSpend}
                                            onChange={(e) => setAvgSpend(Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-emerald-500"
                                        >
                                            <option value={499}>₹499 (Starter Plan)</option>
                                            <option value={1598}>₹1,598 (Growth Plan - Most Popular)</option>
                                            <option value={2999}>₹2,999 (Scale Plan)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-2xl p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                                    <p className="text-slate-400 font-semibold uppercase tracking-widest text-sm mb-4">Estimated Earnings</p>
                                    <div className="text-5xl md:text-6xl font-black text-white flex items-center justify-center gap-2 mb-2">
                                        <span className="text-emerald-400">₹</span>{calculateEarnings().toLocaleString()}
                                    </div>
                                    <p className="text-emerald-400/80 text-sm mt-4">*Assumes a mix of 1st, 2nd, and recurring purchases from your network.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-slate-100 py-24 px-6 border-t border-slate-200">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Why is there a minimum ₹499 spend requirement?</h4>
                                <p className="text-slate-600">We want to partner with people who actually use and believe in our product. The upfront spend prevents spam accounts and ensures a high-quality partner network.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> How do I get paid?</h4>
                                <p className="text-slate-600">You can request a withdrawal straight from your Dashboard Earnings Vault. We process payouts directly to your provided UPI ID or Indian Bank Account within 48-72 hours.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Is there a minimum withdrawal limit?</h4>
                                <p className="text-slate-600">Yes, the minimum withdrawal amount is ₹100. Once your withdrwable balance reaches this threshold, the withdraw button unlocks.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-6">Ready to Build Your Passive Income?</h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Don't leave money on the table. Every B2B business needs leads. Give them the best tool and get paid for it.</p>
                    <Link href="/dashboard/partnership" className="inline-flex bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-emerald-500 transition shadow-xl shadow-emerald-600/20 items-center justify-center gap-2">
                        Go to Earnings Vault <ArrowUpRight className="w-6 h-6" />
                    </Link>
                </section>

            </main>
            <Footer />
        </div>
    );
}
