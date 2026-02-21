import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import { CheckCircle2, XCircle, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

// Simulating a database/CMS entry for competitors to avoid extensive DB migrations immediately.
// We can expand this list easily.
const COMPETITORS: Record<string, { name: string; description: string }> = {
    'justdial': {
        name: 'JustDial',
        description: 'A traditional B2B directory often filled with outdated or generic contact numbers.',
    },
    'indiamart': {
        name: 'IndiaMART',
        description: 'A crowded B2B marketplace where multiple sellers compete for the exact same unverified lead.',
    },
    'tradeindia': {
        name: 'TradeIndia',
        description: 'A B2B portal that relies heavily on manual verification and slow organic inquiries.',
    },
    'lusha': {
        name: 'Lusha',
        description: 'An international data provider that is often too expensive and lacks deep Indian SME coverage.',
    },
    'apollo': {
        name: 'Apollo.io',
        description: 'A great tool for US data but struggles with accurate phone numbers for local Indian businesses.',
    }
};

export async function generateStaticParams() {
    return Object.keys(COMPETITORS).map((competitor) => ({
        competitor: competitor,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
    const { competitor } = await params;
    const data = COMPETITORS[competitor.toLowerCase()];

    if (!data) return { title: 'Compare DhandaLeads' };

    return {
        title: `DhandaLeads vs ${data.name} | The Better Alternative for B2B Leads in India`,
        description: `Looking for an alternative to ${data.name}? See why DhandaLeads offers higher quality, lower bounce rates, and a real Partnership ecosystem for Indian businesses.`,
    };
}

export default async function ComparePage({ params }: { params: Promise<{ competitor: string }> }) {
    const { competitor } = await params;
    const data = COMPETITORS[competitor.toLowerCase()];

    if (!data) return notFound();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Navbar />
            <Toaster position="bottom-left" />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/30 blur-[100px]" />
                        <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-600/30 blur-[100px]" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                            The Smart Alternative to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{data.name}</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            Stop paying for recycled, shared leads. Upgrade to DhandaLeads for exclusive data, automated verification, and a system built for Indian revenue teams.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-20 px-6 bg-slate-900/50 border-y border-white/5 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                            Why DhandaLeads defeats {data.name}
                        </h2>

                        <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-3 bg-slate-800/80 p-6 border-b border-white/10">
                                <div className="font-semibold text-slate-400 uppercase tracking-widest text-sm text-left align-middle flex items-center">Feature</div>
                                <div className="font-bold text-2xl text-center text-slate-300">{data.name}</div>
                                <div className="font-black text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">DhandaLeads</div>
                            </div>

                            {[
                                { feature: 'Lead Exclusivity', rival: 'Shared with 5-10 others', us: '100% Exclusive Data' },
                                { feature: 'Indian B2B Coverage', rival: 'Often Generic / Broad', us: 'Hyper-Local Niche Targeting' },
                                { feature: 'Verification Protocol', rival: 'Dependent on User Input', us: 'AI-Scraped & Pre-Verified' },
                                { feature: 'Refund on Bounces', rival: 'Rarely Honored', us: 'Instant Auto-Credit Refund' },
                                { feature: 'Partnership Program', rival: 'None', us: 'Earn Up to 20% Real Cash' },
                                { feature: 'Pricing Model', rival: 'Expensive Yearly Lock-in', us: 'Pay As You Go (Credits)' },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-3 p-6 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                                    <div className="font-medium text-slate-300">{row.feature}</div>
                                    <div className="text-slate-500 text-center flex flex-col items-center gap-2 text-sm">
                                        <XCircle className="w-6 h-6 text-red-500/50" />
                                        {row.rival}
                                    </div>
                                    <div className="text-emerald-400 font-semibold text-center flex flex-col items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        {row.us}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Narrative / Context */}
                <section className="py-24 px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">The {data.name} Problem</h2>
                        <p className="text-xl text-slate-400 leading-relaxed mb-12">
                            {data.description} When you use {data.name}, you are often competing against your own rivals who are calling the exact same prospects. DhandaLeads flips the script by providing private, verified B2B intelligence.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-colors">
                                <Zap className="w-10 h-10 text-indigo-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">Instant Data Pipeline</h3>
                                <p className="text-slate-400">Don't wait for inquiries to slow drip. Download thousands of target accounts instantly.</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
                                <Target className="w-10 h-10 text-emerald-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">Surgical Precision</h3>
                                <p className="text-slate-400">Filter by exact city, industry, and employee count. No more spraying and praying.</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-orange-500/30 transition-colors">
                                <TrendingUp className="w-10 h-10 text-orange-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-3">Pay As You Grow</h3>
                                <p className="text-slate-400">Only pay for the credits you need. No massive upfront SaaS contracts required.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
