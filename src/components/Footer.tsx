import Link from 'next/link';
import { db } from '@/db';
import { seoCities, seoKeywords } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function Footer() {
    let topCities: { name: string, slug: string }[] = [];
    let defaultKeyword = 'lead-generation-company';

    try {
        topCities = await db.select({ name: seoCities.name, slug: seoCities.slug }).from(seoCities).where(eq(seoCities.isActive, true)).limit(8);
        const keywordData = await db.select({ slug: seoKeywords.slug }).from(seoKeywords).where(eq(seoKeywords.isActive, true)).limit(1);
        if (keywordData.length > 0) defaultKeyword = keywordData[0].slug;
    } catch (e) {
        // Safe fallback for build time
    }

    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 relative z-20">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-8 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <img src="/logo.png" alt="DhandaLeads" className="h-8 w-auto object-contain brightness-0 invert opacity-80 mb-6" />
                    <p className="mb-4 max-w-sm">The smartest B2B data engine for Indian businesses. Find, verify, and close leads on autopilot.</p>
                    <p className="text-white font-bold tracking-wide">A Product of <span className="text-emerald-400">Aiclex Technologies</span></p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Legal & Partners</h4>
                    <ul className="space-y-2">
                        <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/refunds" className="hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
                        <li><Link href="/partnership" className="hover:text-emerald-400 transition-colors">Affiliate Program</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">Locations We Serve</h4>
                    <ul className="space-y-2">
                        {topCities.map((city) => (
                            <li key={city.slug}>
                                <Link
                                    href={`/solutions/${defaultKeyword}/${city.slug}`}
                                    className="hover:text-emerald-400 transition-colors text-sm"
                                >
                                    Lead Generation in {city.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 mt-8 flex flex-col items-center justify-between gap-4 md:flex-row text-sm">
                <span>© {new Date().getFullYear()} Aiclex Technologies. All rights reserved.</span>
                <span className="flex items-center gap-4">
                    <a href="mailto:info@aiclex.in" className="hover:text-emerald-400 transition-colors">info@aiclex.in</a>
                    <a href="tel:+918449488090" className="hover:text-emerald-400 transition-colors">+91 8449488090</a>
                </span>
                <span>Developed by <a href="https://aiclex.in" target="_blank" className="text-emerald-400 hover:text-emerald-300">aiclex.in</a></span>
            </div>
        </footer>
    );
}
