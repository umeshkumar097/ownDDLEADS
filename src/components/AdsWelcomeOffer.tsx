'use client';

import { ArrowRight, Lock, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdsWelcomeOffer() {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(79,70,229,0.4)] animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 border border-emerald-500/30">
                        <Zap className="w-4 h-4 fill-emerald-400" /> Account Activated
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight">
                        You're in! Now, unlock your first <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">500 Verified Leads</span>.
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-2xl">
                        Your dashboard is ready. To start extracting data, you need search credits. Grab our discounted Starter Pack right now to fill your pipeline instantly.
                    </p>

                    <ul className="space-y-4 mb-8 md:mb-0">
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span><strong className="text-white">500</strong> Zero-Bounce Search Credits</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>Less than <strong className="text-white">₹1 per verified contact</strong></span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>Instant Unlock to <strong className="text-white">WhatsApp & CSV</strong></span>
                        </li>
                    </ul>
                </div>

                <div className="w-full md:w-[380px] shrink-0 bg-black/60 border border-white/10 p-8 rounded-3xl text-center backdrop-blur-md relative shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 border border-red-400/50 shadow-lg whitespace-nowrap">
                        One-Time Starter Pack
                    </div>

                    <div className="mt-4 text-slate-500 font-bold line-through mb-1 text-lg">Regular Value: ₹1,999</div>
                    <div className="text-6xl font-black text-white mb-2">₹249</div>
                    <div className="text-indigo-400 text-sm mb-8 font-bold tracking-wide">Plus 18% GST</div>

                    <button
                        onClick={() => router.push('/pricing?plan=249')}
                        className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-black rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                    >
                        Buy 500 Credits <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-slate-500 mt-5 flex items-center justify-center gap-2 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Zero-Bounce Guarantee
                    </p>
                </div>
            </div>
        </div>
    );
}
