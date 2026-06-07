'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldCheck, ArrowRight, Search, CheckCircle2, 
  MessageSquare, Bot, LayoutDashboard, RefreshCcw, 
  Lock, Star, Building2, Globe, Users, Trophy, 
  Briefcase, MousePointer2, Sparkles, ChevronRight,
  TrendingUp, BarChart3, Mail, Phone, Rocket
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicHeroText from '@/components/DynamicHeroText';
import { Toaster } from 'react-hot-toast';

// --- Shared Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export default function HomeClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('b2b');
  const [plans, setPlans] = useState<any[]>([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/library');
        const data = await res.json();
        if (data.plans) setPlans(data.plans);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };
    fetchPlans();
  }, []);

  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#05060f] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />
      <Toaster position="bottom-left" />

      {/* --- 1. PREMIUM HERO SECTION --- */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div 
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 uppercase tracking-widest font-bold">New:</span> 
              AI People Lead Intelligence 2.0 is Live
            </motion.div>

            <motion.div variants={fadeIn} style={{ opacity, scale }}>
              <DynamicHeroText />
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10"
            >
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-2xl flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-bold rounded-2xl transition-all backdrop-blur-md">
                Watch Product Demo
              </button>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="mt-12 flex items-center justify-center gap-4 text-sm text-slate-400 font-medium"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#05060f] overflow-hidden bg-slate-800">
                    <Image 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#05060f] bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">1k+</div>
              </div>
              <p>Trusted by <span className="text-white font-bold">1,200+</span> B2B Sales Teams & Agencies</p>
            </motion.div>
          </motion.div>

          {/* Hero Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-[32px] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0d0e1a] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9]">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0e1a]/80 to-[#0d0e1a]" />
               <Image 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="DhandaLeads Dashboard Preview" 
                fill
                className="object-cover object-top opacity-60"
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50 cursor-pointer hover:scale-110 transition-transform">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mt-6 text-white">Seeing is Believing.</h3>
                  <p className="text-slate-400 mt-2">Take a look at the AI-powered lead engine in action.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. TRUST BAR (MARQUEE) --- */}
      <div className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Data Sourced From Verified Global Channels</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-xl font-bold"><Globe className="w-6 h-6" /> Google Maps</div>
             <div className="flex items-center gap-2 text-xl font-bold"><Users className="w-6 h-6" /> LinkedIn</div>
             <div className="flex items-center gap-2 text-xl font-bold"><Building2 className="w-6 h-6" /> JustDial</div>
             <div className="flex items-center gap-2 text-xl font-bold"><Briefcase className="w-6 h-6" /> IndiaMart</div>
             <div className="flex items-center gap-2 text-xl font-bold"><Globe className="w-6 h-6" /> Web Data</div>
          </div>
        </div>
      </div>

      {/* --- 3. PROBLEM SECTION (THE PAIN) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Why most B2B sales teams <span className="text-red-500 italic">fail</span> in India.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Buying static Excel sheets from 2019 isn&apos;t a strategy. It&apos;s a waste of budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📉",
                title: "Decaying Data",
                desc: "60% of B2B data decays every year. If you aren't searching live, you're calling disconnected numbers.",
                color: "red"
              },
              {
                emoji: "🧱",
                title: "Cold Call Walls",
                desc: "Getting past gatekeepers is impossible without the right decision-maker's direct WhatsApp or Email.",
                color: "orange"
              },
              {
                emoji: "💸",
                title: "Leads are Expensive",
                desc: "Facebook and Google Ads are reaching an all-time high CAC. You need a more surgical approach.",
                color: "amber"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-4xl mb-6">{item.emoji}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. THE AI REVEAL (THE SOLUTION) --- */}
      <section className="py-32 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                Enter the Age of <br />
                <span className="text-emerald-950">Intelligent Leads.</span>
              </h2>
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                DhandaLeads uses proprietary AI to scrape, verify, and enrich data in real-time. We don&apos;t just give you a list; we give you a pipeline.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Data Freshness", val: "100%" },
                  { label: "Verification Accuracy", val: "99.9%" },
                  { label: "Credit Refund Rate", val: "Instant" },
                  { label: "Lead Generation", val: "10x Faster" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                    <div className="text-2xl font-black text-white">{stat.val}</div>
                    <div className="text-xs text-emerald-900 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#05060f] p-8 rounded-[40px] border border-white/10 shadow-3xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-black">1</div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Step One</p>
                      <h4 className="font-bold">Live Web Scraping</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black">2</div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Step Two</p>
                      <h4 className="font-bold">AI Enrichment & Verification</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500 text-white">
                    <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-black">3</div>
                    <div>
                      <p className="text-xs text-emerald-200 font-bold uppercase">Step Three</p>
                      <h4 className="font-bold">1-Click outreach</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. FEATURE SHOWCASE (LEAD INTEL & AI OUTREACH) --- */}
      <section className="py-32 relative" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Built for speed. <br /><span className="text-emerald-500">Optimized for conversion.</span></h2>
              <p className="text-slate-400">Everything you need to find and close leads in one dashboard. No more switching between 5 different tools.</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('b2b')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'b2b' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                B2B Lead Search
              </button>
              <button 
                onClick={() => setActiveTab('people')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'people' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                People Intelligence
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 space-y-4">
              {[
                { icon: <Search className="w-5 h-5" />, title: "Live Maps Engine", desc: "Real-time search for any business in any city globally." },
                { icon: <Bot className="w-5 h-5" />, title: "AI Outreach", desc: "Auto-generate personalized Icebreakers that get replies." },
                { icon: <RefreshCcw className="w-5 h-5" />, title: "Zero-Bounce Refund", desc: "Invalid lead? The credit is back in your wallet instantly." },
                { icon: <Globe className="w-5 h-5" />, title: "WhatsApp Logic", desc: "Direct 1-click WhatsApp message without saving numbers." }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                  <h4 className="font-bold mb-2">{f.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-emerald-600/20 blur-[100px] opacity-30" />
              <div className="h-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 relative z-10 overflow-hidden group">
                <AnimatePresence mode="wait">
                  {activeTab === 'b2b' ? (
                    <motion.div 
                      key="b2b"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Building2 />
                          </div>
                          <div>
                            <h3 className="text-xl font-black">B2B Business Search</h3>
                            <p className="text-xs text-slate-500">Live data from 200+ countries</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex gap-2">
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/10 italic">#Retail</span>
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/10 italic">#Healthcare</span>
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/10 italic">#RealEstate</span>
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 overflow-hidden relative">
                         <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                            <Search className="text-emerald-500 w-5 h-5" />
                            <div className="text-sm text-slate-400 font-mono">Searching for <span className="text-white">&quot;Software Companies in Bangalore&quot;</span>...</div>
                         </div>
                         <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 animate-pulse">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800" />
                                    <div className="space-y-1">
                                      <div className="h-3 w-32 bg-slate-800 rounded" />
                                      <div className="h-2 w-20 bg-slate-800 rounded" />
                                    </div>
                                 </div>
                                 <div className="h-6 w-20 bg-emerald-500/20 rounded-full" />
                              </div>
                            ))}
                         </div>
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <div className="px-6 py-3 bg-emerald-600 rounded-xl font-bold shadow-2xl flex items-center gap-2">
                               <CheckCircle2 className="w-4 h-4" /> 1,248 Leads Found
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="people"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Users />
                          </div>
                          <div>
                            <h3 className="text-xl font-black">People Intelligence</h3>
                            <p className="text-xs text-slate-500">Direct CEO & Founder Contacts</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 overflow-hidden relative">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="flex -space-x-2">
                               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800" />)}
                            </div>
                            <div className="text-sm text-slate-400">Filtering Decision Makers...</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                               <div className="text-lg font-bold text-emerald-500">84%</div>
                               <div className="text-[10px] text-slate-500 uppercase font-bold">Email Open Rate</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                               <div className="text-lg font-bold text-indigo-500">12k+</div>
                               <div className="text-[10px] text-slate-500 uppercase font-bold">Verified CEOs</div>
                            </div>
                         </div>
                         <div className="mt-8 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs italic text-indigo-300">
                           &quot;AI Icebreaker: Congratulations on the recent Series A, [Name]. I saw your growth plans for 2024...&quot;
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. HOW IT WORKS (STEP-BY-STEP) --- */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 italic">The 3-Step Success Loop.</h2>
            <p className="text-slate-500">From search to sales in under 60 seconds.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/5 -z-10" />
            
            {[
              { 
                step: "01", 
                title: "Define Your Target", 
                desc: "Enter keywords like 'Manufacturing in Gujarat' or 'Startup Founders'. Our AI crawls the live web instantly.",
                icon: <MousePointer2 className="w-8 h-8 text-emerald-500" />
              },
              { 
                step: "02", 
                title: "Unlock & Verify", 
                desc: "Unlock the leads you want. Our system checks every phone and email. Invalid? You get an auto-refund.",
                icon: <Sparkles className="w-8 h-8 text-indigo-500" />
              },
              { 
                step: "03", 
                title: "Start the Dhanda", 
                desc: "Download as CSV or use our 1-click WhatsApp/Email outreach buttons to close the deal.",
                icon: <Rocket className="w-8 h-8 text-orange-500" />
              }
            ].map((s, i) => (
              <div key={i} className="relative group text-center md:text-left">
                <div className="text-7xl font-black text-white/5 absolute -top-8 -left-4 pointer-events-none group-hover:text-emerald-500/10 transition-colors">{s.step}</div>
                <div className="mb-6 inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h4 className="text-xl font-bold mb-4">{s.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 7. PRICING SECTION (DYNAMIC) --- */}
      <section className="py-32 relative overflow-hidden" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
           <div className="absolute w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full top-1/4 left-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 italic">Simple Pricing. <span className="text-emerald-500">Massive ROI.</span></h2>
            <p className="text-slate-400 text-lg">Choose a plan that fits your growth stage. No hidden fees. <span className="text-white font-bold underline decoration-emerald-500">GST Invoice included.</span></p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plans.length > 0 ? plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-[32px] border flex flex-col transition-all ${
                  i === 1 
                  ? 'bg-gradient-to-b from-indigo-600/20 to-transparent border-indigo-500 shadow-2xl shadow-indigo-500/20' 
                  : 'bg-white/[0.02] border-white/10'
                }`}
              >
                {i === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">₹{plan.price}</span>
                  <span className="text-slate-500 text-sm">/one-time</span>
                </div>
                
                <div className={`p-4 rounded-2xl mb-8 font-bold text-center border ${
                  i === 1 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {plan.credits} Lead Credits
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced AI Search</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> WhatsApp Direct Logic</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero-Bounce Refunds</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Credits Never Expire</li>
                </ul>

                <Link 
                  href="/register"
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all ${
                    i === 1 ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg' : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Get Started Now
                </Link>
              </motion.div>
            )) : (
              // Skeleton UI for pricing
              [1,2,3].map(i => (
                <div key={i} className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02] animate-pulse h-[500px]" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- 8. FAQ SECTION --- */}
      <section className="py-24 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Common Questions.</h2>
              <p className="text-slate-500 italic">Everything you need to know about DhandaLeads.</p>
           </div>
           
           <div className="space-y-4">
              {[
                { q: "Is the data fresh?", a: "Yes. Unlike other platforms that sell static databases, DhandaLeads crawls the live web in real-time based on your specific query." },
                { q: "What is the Zero-Bounce Refund?", a: "If our AI identifies that a lead's contact info is invalid or the email bounces, your credit is instantly refunded to your wallet. No questions asked." },
                { q: "Do you provide GST Invoices?", a: "Absolutely. During checkout, you can enter your GSTIN and company name to receive a valid B2B tax invoice automatically." },
                { q: "Can I cancel anytime?", a: "Our plans are one-time payments. You buy credits, use them whenever you want, and they never expire. No monthly traps." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                  <summary className="list-none flex items-center justify-between cursor-pointer font-bold text-lg">
                    {faq.q}
                    <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-4 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
           </div>
        </div>
      </section>

      {/* --- 9. ENTERPRISE TRUST (AICLEX) --- */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black">A</div>
                 <h4 className="text-xl font-black">Powered by Aiclex Technologies</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                DhandaLeads is built on the robust data infrastructure of Aiclex Technologies. We handle millions of data points daily with enterprise-grade security and 99.99% uptime.
              </p>
              <div className="flex gap-4">
                 <ShieldCheck className="text-emerald-500" />
                 <Lock className="text-indigo-500" />
                 <ShieldCheck className="text-emerald-500" />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                 <div className="text-2xl font-black text-white">256-bit</div>
                 <div className="text-[10px] text-slate-500 uppercase font-bold">Encryption</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                 <div className="text-2xl font-black text-white">99.9%</div>
                 <div className="text-[10px] text-slate-500 uppercase font-bold">API Uptime</div>
              </div>
           </div>
        </div>
      </section>

      {/* --- 10. FINAL CTA --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600 -z-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="relative z-10"
           >
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 italic">Taiyar ho? <br />Apna Dhanda Badhao.</h2>
              <p className="text-emerald-950 text-xl font-bold mb-12">Join 1,000+ Indian entrepreneurs scaling with AI lead intelligence.</p>
              
              <Link
                href="/register"
                className="px-12 py-6 bg-white text-emerald-800 text-2xl font-black rounded-3xl transition-all hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
              >
                Start Generating Leads Free
              </Link>
           </motion.div>
        </div>
      </section>

      <Footer />


    </div>
  );
}
