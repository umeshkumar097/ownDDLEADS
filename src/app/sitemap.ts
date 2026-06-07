import { MetadataRoute } from 'next';
import { db } from '@/db';
import { seoCities, seoKeywords, seoGeneratedPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dhandaleads.com'; // Replace with actual production URL

    const routes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/blog/b2b-lead-generation-india-2025`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/blog/best-lead-generation-tools-india`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/blog/whatsapp-marketing-b2b-india`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/get-leads-fast`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/partnership`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
        { url: `${baseUrl}/refunds`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    ];

    try {
        // Fetch active cities and keywords for dynamic SEO URLs (Legacy)
        const cities = await db.select({ slug: seoCities.slug }).from(seoCities).where(eq(seoCities.isActive, true));
        const keywords = await db.select({ slug: seoKeywords.slug }).from(seoKeywords).where(eq(seoKeywords.isActive, true));

        // Generate URL permutations (Legacy)
        for (const keyword of keywords) {
            for (const city of cities) {
                routes.push({
                    url: `${baseUrl}/solutions/${keyword.slug}/${city.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                });
            }
        }

        // Fetch Programmatic SEO Pages (New)
        const generatedPages = await db.select({ slug: seoGeneratedPages.slug, updatedAt: seoGeneratedPages.updatedAt })
                                       .from(seoGeneratedPages)
                                       .where(eq(seoGeneratedPages.isPublished, true));
        
        for (const page of generatedPages) {
            routes.push({
                url: `${baseUrl}/${page.slug}`,
                lastModified: page.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            });
        }
    } catch (error) {
        console.error("Failed to generate SEO URLs for sitemap:", error);
    }

    return routes;
}
