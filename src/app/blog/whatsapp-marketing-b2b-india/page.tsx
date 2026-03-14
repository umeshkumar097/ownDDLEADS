import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'WhatsApp Marketing for B2B in India — Complete 2025 Guide',
    description: 'How Indian businesses are using WhatsApp to close B2B deals — with message templates, outreach playbooks, and tools. The definitive guide for Indian entrepreneurs.',
    keywords: ['WhatsApp B2B marketing India', 'WhatsApp business leads India', 'B2B WhatsApp outreach India', 'WhatsApp sales India', 'WhatsApp marketing strategy India'],
    alternates: { canonical: 'https://dhandaleads.com/blog/whatsapp-marketing-b2b-india' },
    openGraph: {
        title: 'WhatsApp Marketing for B2B in India — Complete 2025 Guide',
        description: 'The definitive guide to WhatsApp B2B outreach for Indian businesses.',
        url: 'https://dhandaleads.com/blog/whatsapp-marketing-b2b-india',
        type: 'article',
    }
};

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "WhatsApp Marketing for B2B in India — Complete 2025 Guide",
    "description": "How Indian businesses are using WhatsApp to close B2B deals — with message templates, tools, and a proven outreach system.",
    "author": { "@type": "Organization", "name": "Aiclex Technologies", "url": "https://dhandaleads.com" },
    "publisher": { "@type": "Organization", "name": "DhandaLeads", "logo": { "@type": "ImageObject", "url": "https://dhandaleads.com/logo.png" } },
    "datePublished": "2025-03-14",
    "dateModified": "2025-03-14",
    "url": "https://dhandaleads.com/blog/whatsapp-marketing-b2b-india"
};

const templates = [
    {
        label: "First Touch — Cold Intro",
        message: "Hi [Name], namaskar! Main [Your Name] hun, [Company] se. Aapke [Industry] business ke liye verified B2B contacts ki zaroorat hogi — daily ₹50 se kam mein 100 verified leads. Interested hai dekhne mein? 🙏"
    },
    {
        label: "Follow-Up (Day 3)",
        message: "Hi [Name], I sent a message 3 days back. Bas ek quick follow-up — hamare clients in [City] mein 3x appointment rate dekh rahe hain verified data se. 10 free leads chahiye try karne ke liye?"
    },
    {
        label: "Closing Message",
        message: "Hi [Name], last follow-up 🙏 — Agar aap B2B leads quality improve karna chahte ho, toh DhandaLeads.com check karo. Sign up free hai, credit card nahi chahiye. Aaj try karo!"
    }
];

export default function BlogPost3() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <Navbar />
            <main className="flex-grow max-w-3xl mx-auto px-6 py-20 w-full">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
                        <span>→</span>
                        <span>WhatsApp Marketing</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                        WhatsApp Marketing for B2B in India: The Complete 2025 Guide
                    </h1>
                    <p className="text-slate-500 text-sm">By Aiclex Technologies &bull; March 2025 &bull; 8 min read</p>
                </div>

                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    India has <strong>500+ million WhatsApp users</strong> — and B2B decision-makers are among the most active. If your sales team isn&apos;t using WhatsApp for outreach, you&apos;re leaving deals on the table.
                </p>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">Why WhatsApp Works Better Than Email in India</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-green-700 mb-1">98%</div>
                        <div className="text-sm text-green-800 font-medium">WhatsApp open rate</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-slate-700 mb-1">22%</div>
                        <div className="text-sm text-slate-600 font-medium">Email open rate in India</div>
                    </div>
                </div>

                <p className="text-slate-700 mb-6">
                    In Indian business culture, WhatsApp <em>is</em> the primary communication channel. Decisions are made in WhatsApp groups. Follow-ups happen on WhatsApp. Payment reminders come on WhatsApp. Using email alone for B2B outreach in India is fighting against the current.
                </p>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">The 5-Step WhatsApp B2B Outreach System</h2>

                <div className="space-y-6 mb-10">
                    {[
                        { step: '01', title: 'Build a Verified Contact List', desc: 'Never message someone who hasn\'t authorized WhatsApp contact. Use a tool like DhandaLeads that verifies WhatsApp registration before you send a single message. This prevents blocks and maintains your sender reputation.' },
                        { step: '02', title: 'Craft a Hyper-Localized First Message', desc: 'Reference their city, industry, and a specific pain point. Generic templates get ignored. Specific, short messages get replies.' },
                        { step: '03', title: 'Send at the Right Time', desc: 'Best times for B2B WhatsApp in India: Tuesday–Thursday, 10am–12pm IST or 4pm–6pm IST. Avoid Mondays (hectic) and Fridays (wind-down).' },
                        { step: '04', title: 'Follow Up Exactly 3 Times', desc: 'Day 1 → Day 3 → Day 7. After 3 follow-ups with no response, move on. Over-following damages your reputation.' },
                        { step: '05', title: 'Track Responses in a Simple CRM', desc: 'Even a basic Kanban board works. Mark leads as: Replied, Interested, Demo Booked, Closed. Clarity prevents leads falling through the cracks.' },
                    ].map(item => (
                        <div key={item.step} className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-black text-sm shrink-0">{item.step}</div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-6">3 Proven WhatsApp Templates for Indian B2B</h2>

                <div className="space-y-4 mb-10">
                    {templates.map(t => (
                        <div key={t.label} className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-emerald-600" />
                                <span className="font-bold text-sm text-slate-700">{t.label}</span>
                            </div>
                            <div className="p-4">
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 font-mono text-sm text-slate-700 leading-relaxed">{t.message}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">The Key Tool: DhandaLeads WhatsApp Integration</h2>
                <p className="text-slate-700 mb-6">
                    DhandaLeads doesn&apos;t just give you contacts — it pre-verifies WhatsApp registration for every number and generates a clickable WhatsApp link with a pre-filled message. One click opens the chat with your lead — no saving numbers, no copy-paste.
                </p>

                <div className="bg-indigo-950 text-white rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-black mb-3">Start Your WhatsApp B2B Outreach Today</h3>
                    <p className="text-indigo-300 mb-6">Get 10 free WhatsApp-verified leads. No credit card needed.</p>
                    <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-full transition-colors">
                        Get Free Leads <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
