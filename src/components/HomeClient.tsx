'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Search, CheckCircle2, 
  Bot, LayoutDashboard, RefreshCcw, Lock, Zap,
  Globe, Users, Building2, Briefcase, MousePointer2, Sparkles, ChevronRight,
  TrendingUp, BarChart3, Mail, Phone, Rocket, Target, MapPin, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import AnimatedCounter from '@/components/AnimatedCounter';
import TestimonialCarousel from '@/components/TestimonialCarousel';

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
  const [activeTab, setActiveTab] = useState('b2b');
  const [plans, setPlans] = useState<any[]>([]);
  const heroRef = useRef(null);

  // For Demo Typing Effect
  const [demoQuery, setDemoQuery] = useState("");
  const demoText = "Restaurants in Delhi";
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < demoText.length) {
        setDemoQuery(demoText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDemoStep(1), 500); // Trigger search
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      <Navbar />
      <Toaster position="bottom-left" />

      {/* --- 1. HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-[100vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                Customer in 60s
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-2 font-bold">
              India's leading B2B business database platform.
            </motion.p>
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover verified businesses, decision makers, websites, phone numbers, and company information across India.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-12">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-lg font-bold rounded-2xl transition-all shadow-sm">
                Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeIn} className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-8 max-w-xl mx-auto lg:mx-0">
               <div>
                 <div className="text-2xl font-black text-slate-900">10M+</div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Businesses</div>
               </div>
               <div>
                 <div className="text-2xl font-black text-slate-900">500+</div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Categories</div>
               </div>
               <div>
                 <div className="text-2xl font-black text-slate-900">100+</div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cities</div>
               </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex-1 w-full relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-[32px] blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
               {/* Dashboard Header */}
               <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
               </div>
               {/* Dashboard Body */}
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-3 text-slate-600">
                      <Search className="w-5 h-5 text-emerald-500" />
                      <span className="font-mono text-sm">{demoQuery}<span className="animate-pulse">|</span></span>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3 overflow-hidden relative">
                    {demoStep === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-sm">Waiting for input...</div>
                    )}
                    {demoStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        {[1, 2, 3].map((item, i) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={item} 
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm"
                          >
                             <div className="flex gap-3 items-center">
                               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Building2 className="w-4 h-4"/></div>
                               <div>
                                 <div className="w-24 h-3 bg-slate-200 rounded mb-2"></div>
                                 <div className="w-16 h-2 bg-slate-100 rounded"></div>
                               </div>
                             </div>
                             <div className="flex gap-2">
                               <div className="w-6 h-6 rounded bg-indigo-100" />
                               <div className="w-6 h-6 rounded bg-emerald-100" />
                             </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. LIVE PRODUCT DEMO --- */}
      <section className="py-24 bg-white border-y border-slate-200" id="demo">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">See DhandaLeads in Action</h2>
            <p className="text-slate-600">Experience the speed of our live data engine.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 flex items-center px-6 py-4">
                 <Search className="text-emerald-500 mr-4" />
                 <div className="text-slate-900 font-mono text-lg">{demoStep > 0 ? "Restaurants in Delhi" : "Type a business category and city..."}</div>
               </div>
               <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-colors shadow-md">
                 Search Now
               </button>
             </div>

             <div className="space-y-4">
               {demoStep === 1 ? [
                 { name: "Punjabi Rasoi", phone: "+91 98765 43210", web: "punjabirasoi.in", rating: "4.8", loc: "Connaught Place, Delhi" },
                 { name: "Delhi Heights", phone: "+91 91234 56789", web: "delhiheights.com", rating: "4.5", loc: "Hauz Khas, Delhi" },
                 { name: "The Spice Route", phone: "+91 99887 76655", web: "spiceroute.co.in", rating: "4.9", loc: "Janpath, Delhi" },
               ].map((res, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors"
                 >
                   <div className="mb-4 sm:mb-0">
                     <h4 className="text-xl font-bold text-slate-900 mb-2">{res.name}</h4>
                     <div className="flex gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {res.loc}</span>
                       <span className="flex items-center gap-1 text-emerald-600"><Star className="w-4 h-4 fill-emerald-600"/> {res.rating}</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-bold"><Globe className="w-4 h-4"/> Website</button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold"><Phone className="w-4 h-4"/> Reveal</button>
                   </div>
                 </motion.div>
               )) : (
                 <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-200 rounded-2xl text-slate-400">
                   Awaiting search...
                 </div>
               )}
             </div>
          </div>
        </div>
      </section>

      {/* --- 3. DATABASE PREVIEW --- */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Access Verified Business Data</h2>
            <p className="text-slate-600">High-quality, ready-to-use leads at your fingertips.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden relative shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                    <th className="p-4 font-bold">Business Name</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">City</th>
                    <th className="p-4 font-bold">Rating</th>
                    <th className="p-4 font-bold">Phone Number</th>
                    <th className="p-4 font-bold">Website</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { n: "TechVision Solutions", c: "IT Company", loc: "Bangalore", r: "4.7", p: "+91 98xxx xxxx", w: "techvision..." },
                    { n: "Apex Manufacturers", c: "Manufacturer", loc: "Ahmedabad", r: "4.2", p: "+91 99xxx xxxx", w: "apexgrp..." },
                    { n: "Global Logistics Ltd", c: "Logistics", loc: "Mumbai", r: "4.5", p: "+91 88xxx xxxx", w: "globallog..." },
                    { n: "Sunrise Hospitals", c: "Hospital", loc: "Pune", r: "4.8", p: "+91 77xxx xxxx", w: "sunriseh..." },
                    { n: "Elite Builders", c: "Real Estate", loc: "Gurgaon", r: "4.1", p: "+91 91xxx xxxx", w: "elitebuild..." },
                  ].map((row, i) => (
                    <motion.tr 
                      key={i} 
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="border-b border-slate-100 text-slate-600 transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-500"/> {row.n}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{row.c}</span></td>
                      <td className="p-4">{row.loc}</td>
                      <td className="p-4 text-emerald-600 flex items-center gap-1"><Star className="w-3 h-3 fill-current"/>{row.r}</td>
                      <td className="p-4 font-mono">{row.p}</td>
                      <td className="p-4 text-indigo-600">{row.w}</td>
                    </motion.tr>
                  ))}
                  {/* Blurred rows */}
                  {[1,2,3].map(i => (
                    <tr key={i} className="border-b border-slate-100 text-slate-600 blur-[4px] select-none opacity-50">
                      <td className="p-4 font-bold text-slate-900">Sample Business Pvt Ltd</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs">Category</span></td>
                      <td className="p-4">Sample City</td>
                      <td className="p-4">4.x</td>
                      <td className="p-4 font-mono">+91 xxxx xxxx</td>
                      <td className="p-4 text-indigo-600">website.com</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Overlay CTA */}
            <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-12">
               <Link href="/register" className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                 <Lock className="w-5 h-5" />
                 Unlock Full Database
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. HOW IT WORKS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">From prospect to customer in four simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-slate-200 -z-10" />
            {[
              { step: "01", title: "Search Businesses", desc: "Enter your target category and location.", icon: <Search className="w-6 h-6" /> },
              { step: "02", title: "Apply Filters", desc: "Filter by ratings, website availability, and more.", icon: <Target className="w-6 h-6" /> },
              { step: "03", title: "Export Data", desc: "Download direct contacts in a clean Excel file.", icon: <LayoutDashboard className="w-6 h-6" /> },
              { step: "04", title: "Grow Revenue", desc: "Reach out and convert verified leads into sales.", icon: <TrendingUp className="w-6 h-6" /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto bg-white border-4 border-white rounded-full relative z-10 flex items-center justify-center mb-6">
                   <div className="w-full h-full rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                     {item.icon}
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                     {item.step}
                   </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. WHO USES DHANDALEADS --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Who Uses DhandaLeads</h2>
            <p className="text-slate-600">Powering growth for thousands of Indian businesses.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Sales Teams", "Digital Marketing Agencies", "SaaS Companies", "Recruiters",
              "Consultants", "Startups", "MSMEs", "B2B Service Providers"
            ].map((role, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg hover:border-emerald-500/50 transition-all group"
              >
                <h4 className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{role}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. INDUSTRIES COVERED --- */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12">Massive Industry Coverage</h2>
          <div className="flex flex-wrap justify-center gap-3">
             {[
              "Restaurants", "Hotels", "Hospitals", "Schools", "Colleges", "Manufacturers",
              "Exporters", "Importers", "Builders", "Real Estate", "CA Firms", "Law Firms",
              "IT Companies", "Software", "Logistics", "Recruitment", "Digital Marketing", "And More..."
             ].map((industry, i) => (
               <motion.span 
                 key={i}
                 whileHover={{ scale: 1.1 }}
                 className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700 font-medium hover:border-indigo-500 hover:text-indigo-700 cursor-default transition-colors shadow-sm"
               >
                 {industry}
               </motion.span>
             ))}
          </div>
        </div>
      </section>

      {/* --- 7. WHY DHANDALEADS --- */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
               <div className="absolute -inset-4 bg-emerald-100 blur-3xl rounded-full" />
               <Image 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                 alt="Dashboard Metrics"
                 width={600}
                 height={500}
                 className="rounded-3xl border border-slate-200 relative z-10 shadow-2xl"
               />
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">Why DhandaLeads?</h2>
              <div className="space-y-6">
                {[
                  { title: "Verified Data", desc: "Real-time verification ensures low bounce rates." },
                  { title: "Advanced Filters", desc: "Pinpoint exactly who you want to target." },
                  { title: "Excel Export", desc: "Download clean data ready for CRM import." },
                  { title: "Fast Search", desc: "Generate thousands of leads in under a minute." },
                  { title: "Google Places Powered", desc: "Tapping into the most accurate business registry." },
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-slate-600 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. STATS SECTION --- */}
      <section className="py-24 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: 10000000, suffix: "+", label: "Businesses" },
              { num: 500, suffix: "+", label: "Categories" },
              { num: 100, suffix: "+", label: "Cities" },
              { num: 50000, suffix: "+", label: "Users" }
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
                  <AnimatedCounter value={stat.num} />{stat.suffix}
                </div>
                <div className="text-emerald-300 font-bold tracking-widest uppercase text-sm drop-shadow">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 9. TESTIMONIALS --- */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="text-center mb-16 px-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-slate-600">See what our users are saying about DhandaLeads.</p>
        </div>
        <TestimonialCarousel />
      </section>

      {/* --- 10. USE CASES --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">One Platform, Many Uses</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Lead Generation", i: <Zap className="w-6 h-6 text-yellow-500"/> },
              { t: "Sales Prospecting", i: <Target className="w-6 h-6 text-red-500"/> },
              { t: "Market Research", i: <BarChart3 className="w-6 h-6 text-indigo-500"/> },
              { t: "Recruitment", i: <Users className="w-6 h-6 text-blue-500"/> },
              { t: "Business Development", i: <Briefcase className="w-6 h-6 text-orange-500"/> },
              { t: "Agency Outreach", i: <Globe className="w-6 h-6 text-cyan-500"/> },
              { t: "Local Marketing", i: <MapPin className="w-6 h-6 text-emerald-500"/> },
              { t: "Customer Acquisition", i: <TrendingUp className="w-6 h-6 text-pink-500"/> }
            ].map((uc, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
                <div className="p-3 bg-slate-50 rounded-xl">{uc.i}</div>
                <h4 className="font-bold text-lg text-slate-800">{uc.t}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 11. PRICING --- */}
      <section className="py-32 relative overflow-hidden bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 text-lg">No hidden fees. Pay once, use forever.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 items-center">
            {plans.length > 0 ? plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-[32px] border flex flex-col transition-all h-full ${
                  plan.planName && plan.planName.toLowerCase().includes('growth')
                  ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-300 shadow-2xl shadow-indigo-100 scale-105 z-10' 
                  : 'bg-white border-slate-200 shadow-lg'
                }`}
              >
                {plan.planName && plan.planName.toLowerCase().includes('growth') && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full animate-pulse">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-bold mb-2 text-slate-900">{plan.planName}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900">₹{plan.priceInINR}</span>
                  <span className="text-slate-500 text-sm">/one-time</span>
                </div>
                
                <div className={`p-4 rounded-2xl mb-8 font-bold text-center border ${
                  plan.planName && plan.planName.toLowerCase().includes('growth') ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}>
                  {plan.creditsAwarded} Leads
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Full Database Access</li>
                  <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Excel Export</li>
                  <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Never Expires</li>
                </ul>

                <Link 
                  href="/register"
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all ${
                    plan.planName && plan.planName.toLowerCase().includes('growth') ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            )) : (
              [1,2,3,4].map(i => (
                <div key={i} className="p-8 rounded-[32px] border border-slate-200 bg-slate-50 animate-pulse h-[450px]" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- 12. SEO CONTENT BLOCK --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Business Directories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { t: "Restaurants in Delhi", l: "/solutions/restaurants/delhi" },
               { t: "Hospitals in Mumbai", l: "/solutions/hospitals/mumbai" },
               { t: "Schools in Noida", l: "/solutions/schools/noida" },
               { t: "Manufacturers in Ahmedabad", l: "/solutions/manufacturers/ahmedabad" },
               { t: "CA Firms in Gurgaon", l: "/solutions/ca-firms/gurgaon" },
               { t: "Builders in Pune", l: "/solutions/builders/pune" },
               { t: "Hotels in Jaipur", l: "/solutions/hotels/jaipur" },
               { t: "Dentists in Bangalore", l: "/solutions/dentists/bangalore" },
             ].map((link, i) => (
               <Link key={i} href={link.l} className="text-slate-600 hover:text-emerald-600 text-sm transition-colors hover:underline">
                 {link.t}
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* --- 13. FAQ --- */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
           </div>
           
           <div className="space-y-4">
              {[
                { q: "What is DhandaLeads?", a: "DhandaLeads is India's leading B2B business database platform that allows you to find verified businesses, decision-makers, websites, and phone numbers instantly." },
                { q: "How accurate is the data?", a: "Our data is 99.9% accurate as we use real-time live web scraping and AI verification to ensure you get the freshest leads possible." },
                { q: "How do I get started?", a: "Simply sign up for a free trial, enter your target category and city in the search bar, and watch the leads populate." },
                { q: "Can I export the data?", a: "Yes, all our paid plans include the ability to export your generated leads directly into a clean Excel/CSV file." },
                { q: "What is the Zero-Bounce Refund?", a: "If our system provides an invalid phone number or bounced email, your credit is automatically refunded to your wallet." },
                { q: "Do you cover all cities in India?", a: "Yes, DhandaLeads covers over 100+ cities across India, including all Tier 1, Tier 2, and Tier 3 locations." },
                { q: "What categories of businesses can I find?", a: "You can find over 500+ categories including IT companies, manufacturers, hospitals, restaurants, schools, and real estate builders." },
                { q: "Is this legal and GDPR compliant?", a: "Yes, DhandaLeads only aggregates publicly available B2B contact information from verified public sources." },
                { q: "How does the pricing work?", a: "We offer simple, one-time payment plans where you buy credits. 1 lead unlock = 1 credit. Credits never expire." },
                { q: "Do you offer GST invoices?", a: "Absolutely. You can enter your company details and GSTIN during checkout to automatically receive a B2B tax invoice." },
                { q: "Can I search for specific decision makers?", a: "Yes, our People Intelligence feature allows you to find specific roles like CEOs, Founders, and Directors." },
                { q: "What is AI Outreach?", a: "Our AI analyzes the lead's business and generates a highly personalized icebreaker message that you can send directly via email or WhatsApp." },
                { q: "Can I integrate this with my CRM?", a: "You can easily export your leads as a CSV file and import them into Hubspot, Salesforce, Zoho, or any other CRM." },
                { q: "Is there a free trial?", a: "Yes, we offer a free trial with complimentary credits so you can test the platform's accuracy before purchasing." },
                { q: "Who uses DhandaLeads?", a: "Our platform is trusted by over 50,000 users including sales teams, digital marketing agencies, SaaS companies, and B2B service providers." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm">
                  <summary className="list-none flex items-center justify-between font-bold text-lg text-slate-900">
                    {faq.q}
                    <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-4 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
           </div>
        </div>
      </section>

      {/* --- 14. FINAL CTA --- */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-emerald-600 to-indigo-700">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
           >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Generate More Leads?</h2>
              <p className="text-emerald-100 text-xl mb-12 drop-shadow-md">Start finding verified businesses and decision makers today.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-10 py-5 bg-white text-emerald-900 text-xl font-black rounded-2xl transition-all hover:scale-105 shadow-xl"
                >
                  Start Free Trial
                </Link>
                <button className="px-10 py-5 bg-transparent border-2 border-white/80 text-white text-xl font-bold rounded-2xl transition-all hover:bg-white/10">
                  Book Demo
                </button>
              </div>
           </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
