'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, X, ArrowRight, CheckCircle2, Sparkles, Star } from 'lucide-react';

interface TrialPackPopupProps {
    availableCredits: number;
    userName?: string;
}

export default function TrialPackPopup({ availableCredits, userName }: TrialPackPopupProps) {
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Show popup only when credits are 0 or less
        if (availableCredits <= 0) {
            // Small delay so dashboard loads first
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, [availableCredits]);

    if (!visible) return null;

    const handleGetPack = () => {
        setVisible(false);
        router.push('/pricing');
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.3)]">

                {/* Glowing top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

                {/* Close button */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Special Welcome Offer
                    </div>

                    {/* Greeting */}
                    <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                        {userName ? `Welcome, ${userName.split(' ')[0]}! 👋` : 'Welcome! 👋'}
                    </h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Start finding real B2B leads today with our exclusive <span className="text-white font-semibold">Trial Pack</span> — designed for first-time users.
                    </p>

                    {/* Trial Pack Card */}
                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-1">Trial Pack</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white">₹24</span>
                                        <span className="text-slate-500 line-through text-lg">₹199</span>
                                    </div>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
                                    <span className="text-emerald-400 font-bold text-sm">88% OFF</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {[
                                    '10 Verified B2B Leads',
                                    'AI Icebreaker Messages',
                                    'Email Bounce Protection',
                                    'No subscription required',
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleGetPack}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 text-lg"
                    >
                        <Zap className="w-5 h-5" />
                        Get Trial Pack — ₹24
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        One-time offer. No auto-renewal.
                    </p>
                </div>
            </div>
        </div>
    );
}
