import { notFound, redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { db } from '@/db';
import { seoGeneratedPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import Link from 'next/link';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import { ArrowRight, CheckCircle2, ChevronRight, Zap, Building2, MapPin, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getCachedPage = unstable_cache(
    async (slug: string) => db.select().from(seoGeneratedPages).where(eq(seoGeneratedPages.slug, slug)).limit(1),
    ['seo-generated-page'],
    { revalidate: 3600 }
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const pageData = await getCachedPage(resolvedParams.slug);

    if (!pageData.length || !pageData[0].isPublished) {
        return {
            title: `B2B Lead Generation | DhandaLeads`,
            description: `Discover highly targeted B2B data specific to your location today.`,
        };
    }

    const page = pageData[0];

    return {
        title: page.title,
        description: page.metaDescription,
        openGraph: {
            title: page.title,
            description: page.metaDescription,
        }
    };
}

export default async function ProgrammaticSEOPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const pageData = await getCachedPage(resolvedParams.slug);

    if (!pageData.length || !pageData[0].isPublished) {
        notFound();
    }

    const page = pageData[0];
    const faqs = page.faqs as Array<{q: string, a: string}> || [];
    const contentBlocks = page.contentBlocks as Array<string> || [];
    const businesses = page.businessData as Array<any> || [];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dhandaleads.com" },
            { "@type": "ListItem", "position": 2, "name": "Directory", "item": "https://dhandaleads.com/solutions" },
            { "@type": "ListItem", "position": 3, "name": page.category, "item": `https://dhandaleads.com/solutions/${page.category.toLowerCase().replace(/ /g, '-')}` },
            { "@type": "ListItem", "position": 4, "name": page.city, "item": `https://dhandaleads.com/${page.slug}` },
        ]
    };

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DhandaLeads",
        "description": page.metaDescription,
        "url": `https://dhandaleads.com/${page.slug}`,
        "telephone": "+91-8449488090",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "A-116/117, Okhla Phase II",
            "addressLocality": "New Delhi",
            "postalCode": "110020",
            "addressCountry": "IN"
        },
        "sameAs": ["https://aiclex.in"]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 flex flex-col pt-16">
            <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Script id="localbusiness-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
            <Navbar />

            <main className="flex-1">
                <ExitIntentPopup city={page.city} keyword={page.category} />
                <Toaster position="bottom-left" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-20 px-6 border-b border-white/5">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-8">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/solutions" className="hover:text-white transition-colors">Directory</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-emerald-400">{page.city}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {page.h1Headline}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            {page.metaDescription}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
                                {page.ctaOffer} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Article Content */}
                        <article className="prose prose-invert prose-emerald max-w-none prose-lg">
                            {contentBlocks.map((block, i) => (
                                <div key={i} dangerouslySetInnerHTML={{ __html: block }} className="mb-8" />
                            ))}
                        </article>

                        {/* Mid-Content CTA */}
                        <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Search className="w-32 h-32" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 relative z-10 text-white">Unlock Full {page.category} Database</h3>
                            <p className="text-indigo-200 mb-8 relative z-10 text-lg">
                                Stop wasting time on manual research. Download verified emails, phone numbers, and decision-maker details for {page.category} in {page.city} instantly.
                            </p>
                            <Link href="/login" className="relative z-10 inline-flex px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-slate-100 transition-transform hover:scale-105 shadow-xl">
                                {page.ctaOffer}
                            </Link>
                        </div>

                        {/* Local Business Data Sample */}
                        {businesses && businesses.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Top Rated {page.category} in {page.city}</h3>
                                <div className="grid gap-4">
                                    {businesses.map((biz, idx) => (
                                        <div key={idx} className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-colors">
                                            <div>
                                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-emerald-500" />
                                                    {biz.name}
                                                </h4>
                                                <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4" /> {biz.address || `${page.city}`}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                {biz.rating && (
                                                    <div className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-lg text-sm inline-block">
                                                        ★ {biz.rating} Rating
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center pt-4">
                                    <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4">
                                        View All {page.category} in {page.city} &rarr;
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* FAQs Section */}
                        <div className="space-y-8 pt-8 border-t border-white/5">
                            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <details key={idx} className="group p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
                                        <summary className="list-none flex justify-between items-center cursor-pointer font-semibold text-lg text-white">
                                            {faq.q}
                                            <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <p className="mt-4 text-slate-400 leading-relaxed text-base">
                                            {faq.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Sticky Area */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-28 space-y-6">
                            <div className="p-8 bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-3xl text-center">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Instant Access</h4>
                                <p className="text-slate-400 text-sm mb-6">
                                    Get direct access to decision makers, verified emails, and mobile numbers for {page.category} in {page.city}.
                                </p>
                                <ul className="text-left space-y-3 mb-8 text-sm text-slate-300">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 99% Verified Emails</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> WhatsApp Direct Numbers</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero-Bounce Guarantee</li>
                                </ul>
                                <Link href="/register" className="block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    {page.ctaOffer}
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
