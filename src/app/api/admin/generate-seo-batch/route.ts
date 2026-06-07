import { NextResponse } from 'next/server';
import { db } from '@/db';
import { seoGeneratedPages } from '@/db/schema';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { categories, cities, adminSecret } = body;

        // Basic protection
        if (adminSecret !== process.env.AUTH_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!categories || !cities || !Array.isArray(categories) || !Array.isArray(cities)) {
            return NextResponse.json({ error: 'Invalid input arrays' }, { status: 400 });
        }

        // We process them one by one or push them to a queue. For now, synchronously process the batch (keep batches small, e.g. 5-10 per request to avoid timeout).
        // For production scale, this should be moved to a background worker / cron job queue.
        const results = [];

        for (const category of categories) {
            for (const city of cities) {
                // Formatting URL slug
                let slug = `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-in-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                // Optional edge case for the "company-database-bangalore" format if preferred, but standardizing to 'in' is safest.
                if (slug.endsWith('-in-')) slug = slug.slice(0, -4); // Edge case

                // System Prompt enforcing rules
                const prompt = `You are an expert SEO copywriter. Write a 1000-1500 word highly informative, human-sounding B2B landing page about "${category}" in "${city}". 
Rules:
- NO duplicate paragraphs. NO keyword stuffing.
- Use proper H1, H2, and H3 HTML tags inside the content blocks.
- Generate 5-10 relevant FAQs.
- Generate 5 sample B2B companies/businesses for this category in this city. (Use realistic but fictional/safe data if real isn't available).
- The output MUST be valid JSON matching this schema exactly:
{
  "title": "SEO Title (50-60 chars)",
  "metaDescription": "SEO Meta Description (150-160 chars)",
  "h1Headline": "Main H1 text",
  "contentBlocks": ["HTML string for intro", "HTML string for H2 section", ...],
  "faqs": [{"q": "Question", "a": "Answer"}],
  "businessData": [{"name": "Biz Name", "address": "Address, City", "rating": "4.8"}]
}`;

                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: prompt,
                        config: {
                            responseMimeType: 'application/json',
                        }
                    });

                    const text = response.text;
                    if (!text) throw new Error("Empty AI response");

                    const parsed = JSON.parse(text);

                    // Insert or Update in Database
                    await db.insert(seoGeneratedPages).values({
                        slug,
                        category,
                        city,
                        title: parsed.title,
                        metaDescription: parsed.metaDescription,
                        h1Headline: parsed.h1Headline,
                        contentBlocks: parsed.contentBlocks,
                        faqs: parsed.faqs,
                        businessData: parsed.businessData,
                        ctaOffer: 'Get ₹499 Special Offer',
                        isPublished: true,
                    }).onConflictDoUpdate({
                        target: seoGeneratedPages.slug,
                        set: {
                            title: parsed.title,
                            metaDescription: parsed.metaDescription,
                            contentBlocks: parsed.contentBlocks,
                            faqs: parsed.faqs,
                            businessData: parsed.businessData,
                            updatedAt: new Date()
                        }
                    });

                    results.push({ slug, status: 'success' });
                } catch (aiErr: any) {
                    console.error(`Failed generating ${slug}:`, aiErr.message);
                    results.push({ slug, status: 'error', reason: aiErr.message });
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
