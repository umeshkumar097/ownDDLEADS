import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Search, Zap, CheckCircle2, ArrowRight, Activity, Users, Lock, Check, AlertTriangle, MessageCircle, TrendingUp, HelpCircle, Star, Target, Gift } from 'lucide-react';
import VerifiedLeadCounter from '@/components/VerifiedLeadCounter';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import AdsLeadForm from '@/components/AdsLeadForm';

export const metadata = {
    title: "DhandaLeads | Accelerated B2B Sales Growth Engine",
    description: "Empower your outbound pipeline with intelligent B2B business intelligence and verified corporate profiles across India.",
    keywords: ["B2B sales growth", "business intelligence India", "verified corporate data", "Aiclex Technologies", "DhandaLeads"]
};

export default function GetLeadsFast({ searchParams }: { searchParams: { keyword?: string, city?: string } }) {
    const keyword = searchParams.keyword || 'B2B Leads';
    const city = searchParams.city || 'India';

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <LiveActivityFeed />

            {/* TRUST BAR  */}
            <div className="bg-slate-900 border-b border-indigo-500/20 py-2.5 px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 sticky top-0 z-50 shadow-md">
                <p className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">
                    POWERED BY <span className="text-white font-black tracking-wide">AICLEX TECHNOLOGIES</span>
                </p>
                <div className="hidden sm:block w-px h-4 bg-white/20"></div>
                <VerifiedLeadCounter />
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative pt-20 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-sm font-bold mb-8 text-rose-400 animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        Attention: B2B Agencies & Sales Teams in <span className="capitalize">{city}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                        Stop Wasting Time on Dead Numbers.<br className="hidden md:block" />
                        Discover 500+ Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 capitalize">{keyword}</span> Instantly.
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                        The ultimate AI-driven lead engine built specifically for <span className="text-white font-bold border-b-2 border-indigo-500">Indian Markets</span>.
                        Zero bounces. 1-click WhatsApp export. 1/10th the price of global alternatives.
                    </p>

                    <Link href="#lead-form" className="inline-flex px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl md:text-2xl font-black rounded-2xl items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] mb-6 mt-2 relative overflow-hidden group">
                        <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 slant"></span>
                        <span className="relative">Request Invited Access</span>
                        <ArrowRight className="w-6 h-6 relative" />
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm md:text-base text-slate-400 font-medium mt-4">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> No Credit Card Needed</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Instant WhatsApp Export</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 50 Free Credits Inside</div>
                    </div>
                </div>
            </section>

            {/* 2. PROBLEM AGITATION */}
            <section className="py-24 bg-slate-950 border-y border-white/5 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">You are literally burning money on bad data.</h2>
                        <p className="text-xl text-slate-400 leading-relaxed">Let's be brutally honest about how you're acquiring <span className="capitalize">{keyword}</span> right now:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-rose-950/20 border border-rose-500/20 p-8 rounded-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-rose-500/20 p-3 rounded-xl text-rose-500 shrink-0"><AlertTriangle className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-white mb-2">Expensive Global Tools</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Platforms like Apollo or Lusha cost a fortune ($100+/mo) but lack accurate local data for small/medium Indian MSMEs. You pay for US data you never use.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-rose-950/20 border border-rose-500/20 p-8 rounded-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-rose-500/20 p-3 rounded-xl text-rose-500 shrink-0"><Lock className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-white mb-2">Manual Research Hell</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Your sales team wastes hours manually verifying contacts from raw directories—only to find 40% are disconnected, resulting in demoralized telecallers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SOLUTION INTRO */}
            <section className="py-24 relative overflow-hidden bg-indigo-950/20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">Enter <span className="text-indigo-400">DhandaLeads</span>.</h2>
                    <p className="text-xl text-slate-300 mx-auto mb-12 leading-relaxed">
                        We built a proprietary <strong>Business-Intelligence-Engine</strong> that crawls the open web, discovers live local Indian listings, and verifies every single endpoint before delivering it to your screen.
                        <br /><br />
                        It's fast. It's perfectly targeted for India. And it refuses to charge you for bad data.
                    </p>
                    <Link href="#lead-form" className="inline-flex px-8 py-4 bg-white hover:bg-slate-200 text-indigo-950 text-lg font-black rounded-xl items-center gap-2 transition-all shadow-lg">
                        Request Invite to our <span className="capitalize">{city}</span> Beta
                    </Link>
                </div>
            </section>

            {/* 4. BENEFITS / FEATURES */}
            <section className="py-24 max-w-6xl mx-auto px-6 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-8 text-white leading-tight">The Unfair Advantage for Your Outbound Funnel</h2>
                        <ul className="space-y-8">
                            <li className="flex gap-4">
                                <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400 shrink-0 h-fit"><CheckCircle2 className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">3-Layer Trust Verification</h4>
                                    <p className="text-slate-400">We individually ping emails and WhatsApp numbers. If it bounces or is offline, we destroy it. You only get actionable contacts.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400 shrink-0 h-fit"><Target className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Pinpoint Indian Accuracy</h4>
                                    <p className="text-slate-400">Target specifically down to the municipal level. Find exactly the B2B buyers you need, filtered by precise keywords and Indian pin-codes.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400 shrink-0 h-fit"><MessageCircle className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Native WhatsApp Integration</h4>
                                    <p className="text-slate-400">Bypass email spam filters entirely. Export pristine numbers natively into your WhatsApp marketing pipelines for 90%+ open rates.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-[60px]"></div>
                        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Live System Output Preview</p>
                            <div className="space-y-4">
                                <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                                    <div><p className="font-bold text-white text-sm">Director - DLF Real Estate</p><p className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> WhatsApp Active</p></div>
                                    <span className="bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold text-white group-hover:bg-indigo-500">Uncover</span>
                                </div>
                                <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                                    <div><p className="font-bold text-white text-sm">Founder - TechEdge Solutions</p><p className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Inbox Verified</p></div>
                                    <span className="bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold text-white group-hover:bg-indigo-500">Uncover</span>
                                </div>
                                <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex justify-between items-center opacity-50 block-events-none">
                                    <div><p className="font-bold text-slate-500 text-sm">Manager - Unknown</p><p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> Bounced (Destroyed)</p></div>
                                    <span className="text-xs font-bold text-slate-600">Skipped by AI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS (Efficiency Matrix) */}
            <section className="py-24 bg-black/40 border-y border-white/5 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">From Cold to Sold in 3 Steps</h2>
                        <p className="text-slate-400 text-lg">Compress weeks of prospecting into 60 seconds of automated execution.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl relative group hover:border-indigo-500/50 transition-colors">
                            <div className="absolute -top-6 left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20 transform -rotate-6 group-hover:rotate-0 transition-transform">1</div>
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 mt-2">
                                <Search className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">AI Search Command</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Just type `<span className="capitalize">{keyword}</span> in <span className="capitalize">{city}</span>`. The engine parses millions of records instantly.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl relative group hover:border-purple-500/50 transition-colors">
                            <div className="absolute -top-6 left-6 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-purple-600/20 transform rotate-3 group-hover:rotate-0 transition-transform">2</div>
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 mt-2">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Deep Verification</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Every contact is pinged in real-time. We verify if the WhatsApp number exists and if the email server is actively accepting mail.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl relative group hover:border-emerald-500/50 transition-colors">
                            <div className="absolute -top-6 left-6 w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/20 transform -rotate-6 group-hover:rotate-0 transition-transform">3</div>
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 mt-2">
                                <Activity className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">1-Click Pipeline Fill</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Hit deliver. Load the pristine CSV into your CRM or WhatsApp sender and watch your conversion rates skyrocket on clean intelligence.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="#lead-form" className="inline-flex px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold rounded-xl transition-colors shadow-lg">
                            Request Your Platform Invite
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6 & 7. AUTHORITY & TESTIMONIALS */}
            <section className="py-24 relative overflow-hidden bg-slate-950">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">Driving Sales for Serious Operators</h2>
                        <div className="flex items-center justify-center gap-1 mb-4 text-amber-400 border border-amber-400/20 bg-amber-400/5 w-fit mx-auto px-5 py-2 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <Star className="w-4 h-4 fill-amber-400" />
                            <Star className="w-4 h-4 fill-amber-400" />
                            <Star className="w-4 h-4 fill-amber-400" />
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span className="text-slate-300 text-sm ml-2 font-bold tracking-wide">Trusted by 500+ Indian Startups & Agencies</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative">
                            <div className="absolute top-6 right-6 text-indigo-500/20">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"Pehle mehnge global tools use karte the, but India me accuracy 20% thi. DhandaLeads use kiya toh WhatsApp delivery rate 98% aane laga. Our telecalling ROI doubled in a week."</p>
                            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30 text-lg">RT</div>
                                <div>
                                    <p className="font-bold text-white text-sm">Rahul T.</p>
                                    <p className="text-xs text-slate-400">Digital Agency Owner, Delhi</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative">
                            <div className="absolute top-6 right-6 text-emerald-500/20">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"The best part is they don't charge for dead leads. I ran a search for App Developers, got 600 verified numbers, and closed a $5k development deal the next Thursday."</p>
                            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30 text-lg">VM</div>
                                <div>
                                    <p className="font-bold text-white text-sm">Vikram M.</p>
                                    <p className="text-xs text-slate-400">B2B SaaS Founder</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative">
                            <div className="absolute top-6 right-6 text-purple-500/20">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"Inki pricing unbeatable hai. 499 me 500 leads? Ek lead muje ₹1 se bhi kam me padti hai. Bounce zero hai toh telecallers ka mood kharab nai hota. Phenomenal engine."</p>
                            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold border border-purple-500/30 text-lg">SP</div>
                                <div>
                                    <p className="font-bold text-white text-sm">Sneha P.</p>
                                    <p className="text-xs text-slate-400">Real Estate Broker</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. OFFER BREAKDOWN & PROFIT CALCULATOR */}
            <section className="py-24 bg-slate-900 border-t border-white/5 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">Do the Math. It's a No-Brainer.</h2>
                        <p className="text-slate-400 text-lg">Calculate exactly how much ROI you stand to generate with pristine data.</p>
                    </div>



                    <div className="mt-20 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6 border border-indigo-500/30">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Platform Security
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black mb-6 text-white leading-tight">Why is this platform invite-only?</h3>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium mb-6">
                                We are strictly guarding the quality of our B2B intelligence. Unlike public platforms that allow anyone to blast out spam, DhandaLeads curates its corporate user base.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-4 text-slate-300 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1"><Check className="w-4 h-4 text-emerald-400" /></div>
                                    <span><strong>IP Protection:</strong> We prevent bad actors from ruining WhatsApp sender reputations by verifying intent via form submissions.</span>
                                </li>
                                <li className="flex items-start gap-4 text-slate-300 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1"><Star className="w-4 h-4 fill-emerald-400 text-emerald-400" /></div>
                                    <span><strong>Dedicated Onboarding:</strong> Every approved user receives a dedicated Account Executive to show them the ropes for maximum ROI.</span>
                                </li>
                            </ul>
                            <p className="text-sm text-slate-500 italic">Expected wait time for review is under 24 business hours.</p>
                        </div>
                        <div className="shrink-0 w-full lg:w-[480px]">
                            {/* Inject the Lead Form Component Right Here */}
                            <AdsLeadForm sourceKeyword={keyword} sourceCity={city} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 9 & 10. BONUSES & GUARANTEE */}
            <section className="py-24 bg-indigo-950/10 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Bonus: Partnership */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 p-8 md:p-10 rounded-3xl relative overflow-hidden group shadow-2xl">
                        <div className="absolute -right-10 -top-10 bg-amber-500/10 w-48 h-48 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors"></div>
                        <div className="bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 border border-amber-500/20">
                            <Gift className="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 relative z-10"><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">BONUS:</span> The Agency Partner Frame</h3>
                        <p className="text-slate-400 leading-relaxed mb-6 relative z-10 text-lg">
                            The moment you enroll, you unlock our Partner Portal. Refer your wider network to DhandaLeads and earn a massive <strong>20% Recurring Commission</strong>. Cover your own software costs and turn lead acquisition into a literal profit center.
                        </p>
                    </div>

                    {/* Guarantee */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 p-8 md:p-10 rounded-3xl relative overflow-hidden group shadow-2xl">
                        <div className="absolute -right-10 -top-10 bg-emerald-500/10 w-48 h-48 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 border border-emerald-500/20">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 relative z-10">100% Zero-Bounce Guarantee</h3>
                        <p className="text-slate-400 leading-relaxed mb-6 relative z-10 text-lg">
                            Our promise is absolute. If the DhandaLeads engine delivers an email that bounces or a phone number that is disabled, <strong>you keep your credit</strong>. We only charge you when you receive pristine, verified intelligence. It is a completely risk-free investment.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOUNDER MESSAGE / AUTHORITY */}
            <section className="py-24 bg-slate-950">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 mb-8 relative z-10 bg-slate-800 shadow-xl shadow-indigo-500/20">
                            <Image src="/umesh.jpg" alt="Umesh - CEO of Aiclex Technologies" width={128} height={128} className="object-cover w-full h-full" />
                        </div>

                        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10 leading-tight">"We built the tool we desperately needed."</h3>

                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 italic relative z-10 font-medium">
                            "Hey, I'm Umesh, Founder of Aiclex Technologies. For years, I watched agencies burn tens of thousands of rupees on global databases that simply didn't work in India. The bounce rates were catastrophic.<br /><br />
                            We built DhandaLeads to fix this permanently. It acts as an absolute sniper rifle for your sales team. Beautiful, raw, verified local data. I firmly stake my entire reputation on its efficiency."
                        </p>

                        <div className="relative z-10 bg-white/5 border border-white/10 px-8 py-4 rounded-xl inline-block">
                            <p className="font-black text-white text-xl">Umesh Kumar</p>
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Founder & CEO, Aiclex Technologies</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. FAQ */}
            <section className="py-24 bg-slate-900 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <h4 className="font-bold text-lg text-white mb-3 flex items-start gap-3"><HelpCircle className="w-6 h-6 text-indigo-400 shrink-0" /> What exactly is a "Verified Credit"?</h4>
                            <p className="text-slate-400 text-[15px] leading-relaxed ml-9">1 Credit = 1 successfully unlocked, live contact (Email or Phone number). If the AI flags the contact as dead or if it bounces, zero credits are deducted. You only pay for utility.</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <h4 className="font-bold text-lg text-white mb-3 flex items-start gap-3"><HelpCircle className="w-6 h-6 text-indigo-400 shrink-0" /> Is the aggregated data legally compliant?</h4>
                            <p className="text-slate-400 text-[15px] leading-relaxed ml-9">Absolutely. Our AI engine solely indexes Open-Web resources and public business directories—acting exactly like a hyper-efficient Google Search. We do not access or compromise private databases.</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <h4 className="font-bold text-lg text-white mb-3 flex items-start gap-3"><HelpCircle className="w-6 h-6 text-indigo-400 shrink-0" /> Do my purchased credits expire next month?</h4>
                            <p className="text-slate-400 text-[15px] leading-relaxed ml-9">No. We detest forceful monthly subscriptions. If you buy a ₹249 pack today, those 500 credits sit securely in your wallet until you need them, whether that's tomorrow or next year.</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <h4 className="font-bold text-lg text-white mb-3 flex items-start gap-3"><HelpCircle className="w-6 h-6 text-indigo-400 shrink-0" /> Can I test the platform before buying?</h4>
                            <p className="text-slate-400 text-[15px] leading-relaxed ml-9">Yes. Create a free account right now, and we will instantly fund your wallet with 50 live credits. Try the search, execute an export, and verify the quality yourself without entering a credit card.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12 & 13. URGENCY & FINAL CTA */}
            <section className="py-32 max-w-4xl mx-auto px-6 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full point-events-none -z-10" />

                <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-[1.1] tracking-tight">Every minute you wait, competitors are closing <em>your</em> deals.</h2>

                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Skip the manual line. Get instant access to the exact B2B decision makers you need to scale your revenue this quarter.
                </p>

                <Link href="#lead-form" className="inline-flex px-14 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-2xl font-black rounded-2xl items-center gap-4 transition-all transform hover:scale-105 shadow-[0_0_50px_rgba(79,70,229,0.4)]">
                    Activate The Engine Now <ArrowRight className="w-8 h-8" />
                </Link>

                <div className="mt-8 flex items-center justify-center gap-8 text-sm md:text-base text-slate-400 font-bold">
                    <span className="flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-400" /> SSL Secured Integration</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 50 Verification Credits Inside</span>
                </div>
            </section>

            {/* 14. INJECTED ADS FOOTER (Overrides global for LPs) */}
            <footer className="py-16 bg-[#000] text-center text-slate-500 text-xs md:text-sm border-t border-white/5 relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
                        <Image src="/logo.png" alt="DhandaLeads Logo" width={120} height={30} className="grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>

                    <p className="mb-6 leading-relaxed max-w-2xl mx-auto">
                        DhandaLeads by Aiclex Technologies operates under strict data parity and privacy compliance laws.
                        We provide an advanced public index gateway for B2B discovery and organizational enrichment.
                    </p>

                    <div className="border border-white/5 bg-white/5 rounded-2xl p-6 mb-8 max-w-2xl mx-auto text-left flex flex-col items-center sm:block">
                        <p className="font-bold text-white mb-2 text-center">Business Registration & Contact</p>
                        <p className="leading-relaxed mb-4 text-center">
                            <strong>Aiclex Technologies</strong><br />
                            A-116/117, Okhla Phase II,<br />
                            New Delhi, 110020, India<br />
                            <br />
                            <span className="text-slate-400">GSTIN: 07AAICA8912P1ZN</span> (Verifiable MSME)
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-4 pt-4 border-t border-white/5">
                            <a href="mailto:info@aiclex.in" className="hover:text-indigo-400 transition-colors">📧 info@aiclex.in</a>
                            <a href="tel:+918449488090" className="hover:text-indigo-400 transition-colors">📞 +91 84494 88090</a>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 font-medium text-slate-400">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refunds" className="hover:text-white transition-colors">Cancellation & Refunds</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Support Center</Link>
                    </div>

                    <p className="font-bold tracking-wide uppercase">&copy; {new Date().getFullYear()} Aiclex Technologies. Proudly Engineered in India.</p>
                </div>
            </footer>
        </div>
    );
}
