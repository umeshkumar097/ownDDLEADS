'use client';

import Image from 'next/image';
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  MessageSquare,
  Bot,
  LayoutDashboard,
  RefreshCcw,
  Lock,
  Star,
  ChevronDown,
  Building2,
  Users
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicHeroText from '@/components/DynamicHeroText';
import { Toaster } from 'react-hot-toast';
import TrustWallToast from '@/components/TrustWallToast';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Simple animation for the interactive demo section
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500/20">

      <Navbar />
      <Toaster position="bottom-left" />
      <TrustWallToast />

      {/* 1. Hero Section (The Hook) */}
      <header className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-emerald-50 -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 text-sm font-bold mb-8 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Powered by Aiclex Technologies AI
          </div>

          <DynamicHeroText />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
            <Link
              href="/register"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-lg font-black rounded-full flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-emerald-700/20"
            >
              Start Generating Leads for Free
              <ArrowRight className={`w-6 h-6 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 mb-16">
            <div className="flex -space-x-2 relative z-10">
              <Image src="https://randomuser.me/api/portraits/men/44.jpg" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <Image src="https://randomuser.me/api/portraits/women/60.jpg" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <Image src="https://randomuser.me/api/portraits/men/71.jpg" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <Image src="https://randomuser.me/api/portraits/women/72.jpg" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600">500+</div>
            </div>
            <span className="ml-2">Trusted by 500+ Indian Entrepreneurs & Agencies</span>
          </div>

          {/* Interactive Demo (Mockup) */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative">
            {/* Browser Header */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <div className="mx-auto bg-white px-4 py-1 flex-1 max-w-md rounded text-xs text-slate-400 text-center shadow-sm">app.dhandaleads.com</div>
            </div>
            {/* App Body */}
            <div className="p-8 bg-slate-50 relative min-h-[300px] flex flex-col items-center justify-center">

              <div className="w-full max-w-xl bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3 transition-all duration-500">
                <Search className="text-emerald-600 w-6 h-6" />
                <span className="text-slate-800 font-mono text-lg border-r-2 border-slate-800 pr-1 animate-pulse">
                  {demoStep === 0 ? "Real Estate Mumbai|" : "Real Estate Mumbai"}
                </span>
              </div>

              <div className="w-full max-w-2xl space-y-3">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={item}
                    className={`bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center justify-between transition-all duration-500 transform
                                            ${demoStep > 0 && index < demoStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">R{item}</div>
                      <div className="text-left">
                        <div className="font-bold text-slate-800">Real Estate Agency {item}</div>
                        <div className="text-sm text-slate-500">Mumbai, Maharashtra</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                      <button className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"><MessageSquare className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {demoStep === 0 && <div className="text-slate-400 italic">Listening for queries...</div>}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. The Problem Section (Agitation) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-indigo-950 mb-6">
            "Wahi purane excel sheets aur dead numbers se thak gaye ho?"
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Buying third-party databases is a trap. You waste hours cold calling numbers that don't exist, emails that bounce, and pitches that go to the spam folder. Your sales team deserves better.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">😭</div>
              <h3 className="font-bold text-slate-900 mb-2">Dead Databases</h3>
              <p className="text-slate-600 text-sm">Paying thousands for lists where 60% of leads are outdated or fake.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">🤬</div>
              <h3 className="font-bold text-slate-900 mb-2">Cold Calling Burnout</h3>
              <p className="text-slate-600 text-sm">Your best closers wasting energy on answering machines and wrong numbers.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">💸</div>
              <h3 className="font-bold text-slate-900 mb-2">High Acquisition Cost</h3>
              <p className="text-slate-600 text-sm">Running expensive ads with terrible conversion rates because the targeting is off.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Solution (The DhandaLeads Way) */}
      <section className="py-24 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-bold tracking-widest uppercase text-sm">The Solution</span>
            <h2 className="text-3xl md:text-5xl font-black text-indigo-950 mt-4">The DhandaLeads Way</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">We reversed engineered the lead generation process. No more guessing. Just verified connections.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 -z-10 translate-y-[-50%]"></div>

            <div className="bg-white border text-center p-8 rounded-3xl relative">
              <div className="w-16 h-16 bg-indigo-950 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-lg">1</div>
              <Search className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Laser Search</h3>
              <p className="text-slate-600 text-sm">Target niche keywords, locations, and industries to pull fresh, live data directly from the web.</p>
            </div>

            <div className="bg-white border border-emerald-500 shadow-xl shadow-emerald-500/10 text-center p-8 rounded-3xl relative transform md:-translate-y-4">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-lg">2</div>
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Verification</h3>
              <p className="text-slate-600 text-sm">Our proprietary engine cross-checks emails and phone numbers to ensure zero hard bounces.</p>
            </div>

            <div className="bg-white border text-center p-8 rounded-3xl relative">
              <div className="w-16 h-16 bg-indigo-950 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-lg">3</div>
              <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">1-Click WhatsApp</h3>
              <p className="text-slate-600 text-sm">Instantly open chats with decision-makers without the hassle of saving contact numbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Showcase */}
      <section className="py-24 bg-indigo-950 text-white" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Built to close.<br /><span className="text-emerald-400">Not just find.</span></h2>
              <p className="text-indigo-200 mb-10 text-lg">DhandaLeads brings the entire sales pipeline into one intelligent platform.</p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">AI Meeting Intelligence</h4>
                    <p className="text-indigo-200 text-sm">Automatically summarize transcripts, extract action items, and sync meeting notes directly to the lead profile.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Smart Kanban Dashboard</h4>
                    <p className="text-indigo-200 text-sm">Visually drag-and-drop leads through your custom sales pipeline. Never lose track of a follow-up.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <RefreshCcw className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Zero-Bounce Guarantee (Paisa Vasool)</h4>
                    <p className="text-indigo-200 text-sm">If an email bounces or a number is invalid, our system auto-refunds your lead credit instantly.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Direct WhatsApp Engagement</h4>
                    <p className="text-indigo-200 text-sm">Generate pre-filled, personalized WhatsApp messages and launch them with a single click.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 rounded-[40px] blur-3xl" />
              <div className="bg-slate-900 border border-white/10 p-6 rounded-[32px] relative z-10 shadow-2xl">
                <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Building2 className="w-5 h-5 text-emerald-400" /></div>
                      <div>
                        <div className="text-white font-bold">TechCorp India</div>
                        <div className="text-slate-400 text-xs">CEO: Rahul Sharma</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">Valid</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-indigo-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><Bot className="w-5 h-5 text-indigo-400" /></div>
                      <div>
                        <div className="text-white font-bold text-sm">AI Suggested Icebreaker</div>
                        <div className="text-slate-400 text-xs mt-1 leading-relaxed">"Hi Rahul, noticed TechCorp's recent expansion in Mumbai. Would love to discuss..."</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 mt-4 text-sm transition-colors">
                    <MessageSquare className="w-4 h-4" /> Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Authority (Powered by Aiclex) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Lock className="w-12 h-12 text-indigo-950 mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6">Powered by Aiclex Technologies</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
            We don't just build tools; we build enterprise-grade engines. DhandaLeads leverages Aiclex's massive data infrastructure, ensuring state-of-the-art security, 99.9% uptime, and industry-leading AI accuracy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm"><ShieldCheck className="w-4 h-4 text-emerald-600" /> GDPR & DPDP Compliant</span>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm"><Lock className="w-4 h-4 text-indigo-600" /> AES-256 Encryption</span>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm"><Bot className="w-4 h-4 text-purple-600" /> LLM Advanced Proxies</span>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section (The Trap) */}
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-indigo-950 mb-4">Pay Only For Results</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Skip the expensive monthly retainers. Buy what you need, use it forever. <span className="font-bold text-emerald-700">Valid GST Invoices provided.</span></p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">

            {/* Starter */}
            <div className="border border-slate-200 bg-white rounded-3xl p-8 flex flex-col shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="text-4xl font-black text-indigo-950 mb-2">Free</div>
              <p className="text-slate-500 text-sm mb-6">Test the waters</p>

              <div className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg text-center mb-8">Daily Limits Apply</div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Basic Search</li>
                <li className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Standard Verification</li>
              </ul>

              <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-800 font-bold hover:bg-slate-50 transition-colors">Start Free</button>
            </div>

            {/* Pro (Growth) */}
            <div className="border-2 border-emerald-600 bg-indigo-950 rounded-3xl p-8 flex flex-col shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white font-bold px-4 py-1 rounded-full text-sm tracking-wide shadow-lg">MOST POPULAR</div>
              <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
              <div className="text-4xl font-black text-white mb-2">₹3,999</div>
              <p className="text-indigo-200 text-sm mb-6">For serious marketers</p>

              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold px-4 py-2 rounded-lg text-center mb-8">500 Credits</div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Advanced Google Maps Engine</li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Zero-Bounce Auto Refund</li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> AI Icebreakers & Summaries</li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Credits Never Expire</li>
              </ul>

              <Link href="/pricing" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors text-center shadow-lg">Get 500 Credits</Link>
            </div>

            {/* Agency (Scale) */}
            <div className="border border-slate-200 bg-white rounded-3xl p-8 flex flex-col shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Scale</h3>
              <div className="text-4xl font-black text-indigo-950 mb-2">₹6,999</div>
              <p className="text-slate-500 text-sm mb-6">For agencies & large teams</p>

              <div className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg text-center mb-8">1000 Credits</div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Everything in Growth</li>
                <li className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Bulk CSV Exports</li>
                <li className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Dedicated Account Manager</li>
              </ul>

              <Link href="/pricing" className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-800 font-bold hover:bg-slate-50 transition-colors text-center">Get 1000 Credits</Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ & Risk Reversal */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-indigo-950 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Are these leads scraped or real?</h4>
              <p className="text-slate-600 mt-2">DhandaLeads searches public business directories in real-time. We don't sell recycled, dead data. Our AI verifies every endpoint before you spend a credit.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> What if the email bounces?</h4>
              <p className="text-slate-600 mt-2">Paisa Vasool. Our system automatically detects hard bounces or invalid numbers and instantly refunds the credit back to your platform wallet.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> I need a GST Invoice for my business.</h4>
              <p className="text-slate-600 mt-2">Yes, simply enter your company details and GSTIN during the Razorpay/Stripe checkout process to receive an automatic B2B tax invoice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-emerald-700 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Apna Dhanda Badhao, Aaj Hi Shuru Karo.
          </h2>
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="px-10 py-5 bg-white text-emerald-800 text-xl font-black rounded-full transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />

    </div>
  );
}
