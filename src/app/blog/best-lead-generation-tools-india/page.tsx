import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Best B2B Lead Generation Tools in India (2025 Comparison)',
    description: 'We compare the top B2B lead generation tools for Indian businesses — Apollo.io vs JustDial vs DhandaLeads vs LinkedIn Sales Navigator. See which tool wins for Indian markets.',
    keywords: ['best lead generation tool India', 'Apollo.io India alternative', 'JustDial vs DhandaLeads', 'B2B database tool India', 'lead generation software India'],
    alternates: { canonical: 'https://dhandaleads.com/blog/best-lead-generation-tools-india' },
    openGraph: {
        title: 'Best B2B Lead Generation Tools in India (2025)',
        description: 'Side-by-side comparison of the top lead generation tools for Indian sales teams.',
        url: 'https://dhandaleads.com/blog/best-lead-generation-tools-india',
        type: 'article',
    }
};

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best B2B Lead Generation Tools in India (2025 Comparison)",
    "description": "We compare Apollo.io, JustDial, LinkedIn Sales Navigator, and DhandaLeads for Indian B2B teams.",
    "author": { "@type": "Organization", "name": "Aiclex Technologies", "url": "https://dhandaleads.com" },
    "publisher": { "@type": "Organization", "name": "DhandaLeads", "logo": { "@type": "ImageObject", "url": "https://dhandaleads.com/logo.png" } },
    "datePublished": "2025-03-14",
    "dateModified": "2025-03-14",
    "url": "https://dhandaleads.com/blog/best-lead-generation-tools-india"
};

const tools = [
    {
        name: "DhandaLeads",
        price: "₹899/mo",
        indiaFocus: true,
        verified: true,
        whatsapp: true,
        gstInvoice: true,
        verdict: "🏆 Best for India",
        color: "emerald"
    },
    {
        name: "Apollo.io",
        price: "$49/mo",
        indiaFocus: false,
        verified: true,
        whatsapp: false,
        gstInvoice: false,
        verdict: "Good for global",
        color: "slate"
    },
    {
        name: "JustDial API",
        price: "₹2,000+/mo",
        indiaFocus: true,
        verified: false,
        whatsapp: false,
        gstInvoice: true,
        verdict: "B2C focused",
        color: "slate"
    },
    {
        name: "LinkedIn Sales Nav",
        price: "$99/mo",
        indiaFocus: false,
        verified: false,
        whatsapp: false,
        gstInvoice: false,
        verdict: "Enterprise heavy",
        color: "slate"
    }
];

export default function BlogPost2() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <Navbar />
            <main className="flex-grow max-w-3xl mx-auto px-6 py-20 w-full">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
                        <span>→</span>
                        <span>Tools Comparison</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                        Best B2B Lead Generation Tools in India — Compared (2025)
                    </h1>
                    <p className="text-slate-500 text-sm">By Aiclex Technologies &bull; March 2025 &bull; 7 min read</p>
                </div>

                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    With dozens of lead generation tools on the market, choosing the right one for your Indian B2B team is confusing. We&apos;ve tested them all — here&apos;s our honest breakdown.
                </p>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-6">Side-by-Side Comparison</h2>

                <div className="overflow-x-auto mb-10">
                    <table className="w-full border border-slate-200 rounded-xl text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-slate-900">Tool</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-900">Price</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-900">India Data</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-900">Verified Leads</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-900">WhatsApp</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-900">GST Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tools.map(tool => (
                                <tr key={tool.name} className={tool.name === 'DhandaLeads' ? 'bg-emerald-50' : ''}>
                                    <td className="px-4 py-3 font-bold text-slate-900">{tool.name === 'DhandaLeads' ? `🏆 ${tool.name}` : tool.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{tool.price}</td>
                                    <td className="px-4 py-3 text-center">{tool.indiaFocus ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}</td>
                                    <td className="px-4 py-3 text-center">{tool.verified ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}</td>
                                    <td className="px-4 py-3 text-center">{tool.whatsapp ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}</td>
                                    <td className="px-4 py-3 text-center">{tool.gstInvoice ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">Our Verdict: DhandaLeads Wins for Indian B2B</h2>
                <p className="text-slate-700 mb-6">
                    Apollo.io is excellent for global outreach, but it lacks India-specific data depth — especially for Tier-2 and Tier-3 cities. JustDial is consumer-focused and expensive. LinkedIn Sales Navigator is priced in USD, making it inaccessible for most Indian SMBs.
                </p>
                <p className="text-slate-700 mb-6">
                    <strong>DhandaLeads</strong> is the only tool built specifically for Indian B2B — with hyperlocal Google Maps intelligence, WhatsApp outreach integration, GST invoicing, and a zero-bounce credit guarantee. At ₹899/mo, it&apos;s also 5x cheaper than global alternatives.
                </p>

                <div className="bg-indigo-950 text-white rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-black mb-3">Try DhandaLeads Free</h3>
                    <p className="text-indigo-300 mb-6">No credit card required. Get 10 free verified leads on signup.</p>
                    <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-full transition-colors">
                        Start Free <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
