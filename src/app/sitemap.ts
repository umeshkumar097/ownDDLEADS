import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://dhandaleads.com'; // Replace with actual production URL

    // Define all static pages
    const routes = [
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

    return [...routes];
}
