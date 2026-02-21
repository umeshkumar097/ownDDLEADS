import { MetadataRoute } from 'next';
import { db } from '@/db';
import { seoCities, seoKeywords } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dhandaleads.com'; // Replace with actual production URL

    // Define all static pages
    const routes: MetadataRoute.Sitemap = [
        '',
        '/pricing',
        '/contact',
        '/partnership',
        '/privacy',
        '/terms',
        '/refunds',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Fetch active cities and keywords for dynamic SEO URLs
        const cities = await db.select({ slug: seoCities.slug }).from(seoCities).where(eq(seoCities.isActive, true));
        const keywords = await db.select({ slug: seoKeywords.slug }).from(seoKeywords).where(eq(seoKeywords.isActive, true));

        // Generate URL permutations
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
    } catch (error) {
        console.error("Failed to generate SEO URLs for sitemap:", error);
    }

    return routes;
}
