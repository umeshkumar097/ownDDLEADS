import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://dhandaleads.com'; // Replace with actual production URL

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/admin/', '/api/'], // Prevent indexing of private areas
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
