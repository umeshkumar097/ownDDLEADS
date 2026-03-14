import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'B2B Lead Generation Blog India — DhandaLeads Insights',
    description: 'Expert guides on B2B lead generation, WhatsApp marketing, and sales growth strategies for Indian businesses. Updated weekly by the Aiclex Technologies team.',
    alternates: { canonical: 'https://dhandaleads.com/blog' },
    openGraph: {
        title: 'B2B Lead Generation Blog India — DhandaLeads',
        description: 'Expert guides for Indian entrepreneurs on generating quality B2B leads.',
        url: 'https://dhandaleads.com/blog',
    }
};

const posts = [
    {
        slug: 'b2b-lead-generation-india-2025',
        title: 'How to Get B2B Leads in India in 2025 (Complete Guide)',
        description: 'A step-by-step guide to building a predictable B2B lead pipeline in India using Google Maps, LinkedIn, and AI-powered verification tools.',
        readTime: '9 min read',
        tag: 'Lead Generation',
        date: 'March 2025',
    },
    {
        slug: 'best-lead-generation-tools-india',
        title: 'Best B2B Lead Generation Tools in India — Compared (2025)',
        description: 'We compare the top lead generation tools available to Indian businesses — from Apollo.io to JustDial to DhandaLeads — so you can choose the right one.',
        readTime: '7 min read',
        tag: 'Tools Comparison',
        date: 'March 2025',
    },
    {
        slug: 'whatsapp-marketing-b2b-india',
        title: 'WhatsApp Marketing for B2B in India: The Complete 2025 Guide',
        description: 'How Indian businesses are using WhatsApp to close more B2B deals — with templates, tools, and a proven 5-step outreach system.',
        readTime: '8 min read',
        tag: 'WhatsApp Marketing',
        date: 'March 2025',
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-5xl mx-auto px-6 py-20 w-full">
                <div className="text-center mb-16">
                    <span className="text-emerald-700 font-bold tracking-widest uppercase text-sm">Insights &amp; Guides</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-4">B2B Sales &amp; Lead Generation Blog</h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">Expert tips, strategies, and guides for Indian entrepreneurs and sales teams looking to scale their outbound pipeline.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:border-emerald-400 hover:shadow-lg transition-all">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4 self-start flex items-center gap-1"><Tag className="w-3 h-3" />{post.tag}</span>
                            <h2 className="text-lg font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">{post.title}</h2>
                            <p className="text-slate-600 text-sm flex-grow mb-4">{post.description}</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                <span className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                                <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
