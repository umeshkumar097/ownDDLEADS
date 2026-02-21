import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { seoCities, seoKeywords, seoTranslations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import TrustWallToast from '@/components/TrustWallToast';
export const revalidate = 2592000; // Cache for 30 days
import { CheckCircle2, ArrowRight, BarChart3, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

// 1. Generate Static Params for all Keyword x City Combinations
// NOTE: Due to Vercel/Next.js limits + build time optimization, we can either
// pre-generate ALL or rely on dynamic evaluation on first hit.
// Since we have ~416 routes (52 * 8), this is perfectly safe to generate statically at build time.
export async function generateStaticParams() {
    const cities = await db.select({ slug: seoCities.slug }).from(seoCities).where(eq(seoCities.isActive, true));
    const keywords = await db.select({ slug: seoKeywords.slug }).from(seoKeywords).where(eq(seoKeywords.isActive, true));

    const params: { keyword: string, city: string }[] = [];

    for (const keyword of keywords) {
        for (const city of cities) {
            params.push({
                keyword: keyword.slug,
                city: city.slug
            });
        }
    }

    return params;
}

// 2. Dynamic Metadata Injection
export async function generateMetadata({ params, searchParams }: { params: Promise<{ keyword: string, city: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    let keywordData = await db.select().from(seoKeywords).where(eq(seoKeywords.slug, resolvedParams.keyword)).limit(1);
    const cityData = await db.select().from(seoCities).where(eq(seoCities.slug, resolvedParams.city)).limit(1);

    if (!keywordData.length || !cityData.length) {
        return {
            title: `B2B Lead Generation in India | DhandaLeads`,
            description: `Looking for the best B2B leads in India? Discover highly targeted B2B data specific to your location today.`,
        };
    }

    const keyword = keywordData[0];
    const city = cityData[0];

    // Translation Override Check
    let intentHeadline = keyword.intentHeadline;
    let contextParagraph = keyword.contextParagraph;

    if (resolvedSearchParams.lang && typeof resolvedSearchParams.lang === 'string') {
        const translation = await db.select()
            .from(seoTranslations)
            .where(
                and(
                    eq(seoTranslations.keywordId, keyword.id),
                    eq(seoTranslations.languageCode, resolvedSearchParams.lang)
                )
            ).limit(1);
        if (translation.length > 0) {
            intentHeadline = translation[0].translatedTitle;
            contextParagraph = translation[0].translatedContent;
        }
    }

    // E.g. "Top Rated B2B Lead Generation Tools in Mumbai | DhandaLeads"
    const title = `${intentHeadline} in ${city.name} | DhandaLeads`;
    const description = `Looking for the best ${keyword.keyword.toLowerCase()} in ${city.name}? ${contextParagraph || 'Discover highly targeted B2B data specific to your location today.'}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    };
}

export default async function DynamicSEOLandingPage({ params, searchParams }: { params: Promise<{ keyword: string, city: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const keywordData = await db.select().from(seoKeywords).where(eq(seoKeywords.slug, resolvedParams.keyword)).limit(1);
    const cityData = await db.select().from(seoCities).where(eq(seoCities.slug, resolvedParams.city)).limit(1);

    let keyword = keywordData[0];
    let city = cityData[0];

    // Fallback System: Redirect to India if not found
    if (!keywordData.length || !cityData.length) {
        if (resolvedParams.city !== 'india') {
            const fallbackKeyword = keywordData.length ? resolvedParams.keyword : 'lead-generation-company';
            redirect(`/solutions/${fallbackKeyword}/india`);
        }

        // If it's already on 'india' but not in DB, fabricate the object to avoid 404 crash
        if (!cityData.length) {
            city = { name: 'India', slug: 'india', state: 'National', isActive: true, id: 0, createdAt: new Date() };
        }
        if (!keywordData.length) {
            keyword = { keyword: 'Lead Generation Company', slug: 'lead-generation-company', intentHeadline: 'The #1 B2B Lead Generation Company', contextParagraph: null, isActive: true, id: 0, createdAt: new Date() };
        }
    }

    // Translation Override Check
    let intentHeadline = keyword.intentHeadline;
    let contextParagraph = keyword.contextParagraph;

    if (resolvedSearchParams.lang && typeof resolvedSearchParams.lang === 'string') {
        const translation = await db.select()
            .from(seoTranslations)
            .where(
                and(
                    eq(seoTranslations.keywordId, keyword.id),
                    eq(seoTranslations.languageCode, resolvedSearchParams.lang)
                )
            ).limit(1);
        if (translation.length > 0) {
            intentHeadline = translation[0].translatedTitle;
            contextParagraph = translation[0].translatedContent;
        }
    }

    // Build the dynamic variables
    const heroSubheadline = contextParagraph || `Supercharge your B2B sales in ${city.name} with precise, verified data tailored for your precise ideal customer profile.`;
    const trustSignal = `Trusted by over 500+ Businesses scaling locally in ${city.name}, ${city.state}.`;

    // Build JSON-LD FAQs
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How to get ${keyword.keyword.toLowerCase()} in ${city.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `DhandaLeads provides a powerful AI-driven platform to extract and verify B2B ${keyword.keyword.toLowerCase()} in ${city.name} instantly. Simply sign up, search for your target audience, and unlock verified emails and phone numbers.`
                }
            },
            {
                "@type": "Question",
                "name": `Are the leads from ${city.name} verified?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, every single lead generated for ${city.name} goes through our real-time verification process, ensuring a 99% delivery rate for emails and authentic LinkedIn profiles.`
                }
            },
            {
                "@type": "Question",
                "name": `What industries do you cover in ${city.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `We cover all major B2B sectors in ${city.name}, including IT, Manufacturing, Real Estate, Healthcare, and Corporate Services.`
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 flex flex-col pt-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <Navbar />

            <main className="flex-1">
                <ExitIntentPopup city={city.name} keyword={keyword.keyword} />
                <Toaster position="bottom-left" />
                <TrustWallToast />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32 px-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/20 blur-[120px]" />
                    </div>

                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold mb-8 text-sm md:text-base animate-fade-in-up">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            Local Coverage Active: {city.name}, {city.state}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            {intentHeadline} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 flex items-center justify-center gap-2 mt-2">
                                in {city.name}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                            {heroSubheadline}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1">
                                Start Getting Leads in {city.name} <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/5 border border-white/20 transition-all flex items-center justify-center gap-2 text-lg">
                                View Data Plans
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                            <Building2 className="w-4 h-4 text-slate-600" />
                            {trustSignal}
                        </div>
                    </div>
                </section>

                {/* Features Section Matrix */}
                <section className="py-20 bg-black/40 border-y border-white/5 relative z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Hyper-Targeted in {city.name}</h3>
                                <p className="text-slate-400 leading-relaxed">Filter completely by {city.name}-based industries, company size, and specific decision-maker roles. Stop wasting time on irrelevant global lists.</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">99% Delivery Rate</h3>
                                <p className="text-slate-400 leading-relaxed">Every email and phone number is AI-verified in real-time before you spend a single credit. Say goodbye to bounced local outreach campaigns.</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-rose-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6 text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Instant Data Extraction</h3>
                                <p className="text-slate-400 leading-relaxed">Need leads in {city.name} today? Our real-time data engine bypasses manual scrape times, generating `{keyword.keyword.toLowerCase()}` direct to your CRM.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="py-20 bg-slate-950 border-t border-white/5 relative z-10">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqSchema.mainEntity.map((faq, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-xl font-bold mb-3 text-indigo-300">{faq.name}</h3>
                                    <p className="text-slate-300 leading-relaxed tracking-wide">{faq.acceptedAnswer.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 relative z-10 border-t border-white/5">
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-indigo-900/40 to-black border border-indigo-500/20 p-12 md:p-16 rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 text-white leading-tight">
                            Dominate the {city.name} Market
                        </h2>
                        <p className="text-xl text-indigo-200/80 mb-10 relative z-10 max-w-2xl mx-auto">
                            Join hundreds of smart agencies scaling their revenue locally without expensive ad campaigns. Start generating the absolute best {keyword.keyword.toLowerCase()} now.
                        </p>
                        <Link href="/register" className="relative z-10 inline-flex px-10 py-5 bg-indigo-600 text-white font-bold tracking-wide rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:-translate-y-1 text-lg">
                            Claim Your 10 Free Credits
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
