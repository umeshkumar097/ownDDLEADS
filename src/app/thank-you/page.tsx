import Link from 'next/link';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';
import VerifiedLeadCounter from '@/components/VerifiedLeadCounter';

export const metadata = {
    title: "Request Received | DhandaLeads by Aiclex",
    description: "Thank you for requesting access to the DhandaLeads B2B Engine.",
    robots: "noindex, nofollow" // Important: Keep this out of search engines as it's a conversion page
};

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">

            {/* TRUST BAR  */}
            <div className="bg-slate-900 border-b border-indigo-500/20 py-2.5 px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 sticky top-0 z-50 shadow-md">
                <p className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">
                    POWERED BY <span className="text-white font-black tracking-wide">AICLEX TECHNOLOGIES</span>
                </p>
                <div className="hidden sm:block w-px h-4 bg-white/20"></div>
                <VerifiedLeadCounter />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative p-6">

                {/* Visual Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/30 mx-auto leading-none shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-8 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>

                <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
                        <Target className="w-4 h-4" /> Next Steps
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
                        Access Request <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Secured.</span>
                    </h1>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 shadow-xl backdrop-blur-sm text-center max-w-xl mx-auto">
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-4">
                            You are officially in the queue.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            An onboarding specialist from Aiclex Technologies will review your request and reach out on your WhatsApp number within <strong>24 business hours</strong> to guide you through the platform and approve your account.
                        </p>
                    </div>

                    <Link href="/" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-xl transition-all hover:border-slate-500">
                        Explore Our Public Database <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <footer className="py-8 bg-black/50 text-center text-slate-500 text-xs md:text-sm border-t border-white/5 relative z-10 w-full">
                <p className="font-bold tracking-wide uppercase">&copy; {new Date().getFullYear()} Aiclex Technologies. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
