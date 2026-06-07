import { db } from '@/db';
import { seoGeneratedPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Locations & Categories | DhandaLeads',
    description: 'Browse our complete directory of local business data, B2B leads, and category-specific databases across all major cities.',
};

export default async function LocationsDirectory() {
    // Fetch all published generated pages
    const pages = await db.select({
        slug: seoGeneratedPages.slug,
        category: seoGeneratedPages.category,
        city: seoGeneratedPages.city,
    }).from(seoGeneratedPages).where(eq(seoGeneratedPages.isPublished, true));

    // Group by City
    const groupedByCity = pages.reduce((acc, page) => {
        if (!acc[page.city]) acc[page.city] = [];
        acc[page.city].push(page);
        return acc;
    }, {} as Record<string, typeof pages>);

    const cities = Object.keys(groupedByCity).sort();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col pt-16">
            <Navbar />
            <main className="flex-1 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                        Locations & Categories Directory
                    </h1>
                    <p className="text-lg text-slate-400 mb-12">
                        Browse our extensive database of local B2B leads and companies by city and industry.
                    </p>

                    {cities.length === 0 ? (
                        <div className="p-12 text-center border border-white/10 rounded-2xl bg-slate-900/50 text-slate-400">
                            <p>No localized databases available right now. We are generating new cities and categories!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cities.map((city) => (
                                <div key={city} className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                                        <MapPin className="text-emerald-500 w-6 h-6" />
                                        {city}
                                    </h2>
                                    <ul className="space-y-3">
                                        {groupedByCity[city].map((page) => (
                                            <li key={page.slug}>
                                                <Link 
                                                    href={`/${page.slug}`}
                                                    className="text-slate-300 hover:text-emerald-400 transition-colors block text-sm"
                                                >
                                                    {page.category} in {page.city}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
