import 'dotenv/config';
import { db } from './index';
import { seoKeywords } from './schema';

const keywords = [
    {
        keyword: 'Leads Generation Tools',
        slug: 'leads-generation-tools',
        intentHeadline: 'The Best Leads Generation Tools',
        contextParagraph: 'Discover powerful leads generation tools to extract local B2B data efficiently.'
    },
    {
        keyword: 'Lead Generation Company',
        slug: 'lead-generation-company',
        intentHeadline: 'Top B2B Lead Generation Company',
        contextParagraph: 'Partner with the leading lead generation company to scale your sales outreach.'
    },
    {
        keyword: 'Lead Generation Meaning',
        slug: 'lead-generation-meaning',
        intentHeadline: 'Understanding Lead Generation Meaning',
        contextParagraph: 'Learn the exact lead generation meaning and how it transforms your business.'
    },
    {
        keyword: 'Lead Generation GPT',
        slug: 'lead-generation-gpt',
        intentHeadline: 'AI-Powered Lead Generation GPT',
        contextParagraph: 'Leverage the ultimate Lead Generation GPT engine to find verified B2B contacts.'
    },
    {
        keyword: 'Lead Generation World',
        slug: 'lead-generation-world',
        intentHeadline: 'Your Gateway to the Lead Generation World',
        contextParagraph: 'Step into the lead generation world with pristine, reliable, and verified data.'
    },
    {
        keyword: 'Lead Generation Specialist',
        slug: 'lead-generation-specialist',
        intentHeadline: 'Hire a Lead Generation Specialist',
        contextParagraph: 'Work like a true lead generation specialist using our precise data extraction platform.'
    },
    {
        keyword: 'Lead Generation Process',
        slug: 'lead-generation-process',
        intentHeadline: 'Optimize Your Lead Generation Process',
        contextParagraph: 'Automate your lead generation process and ensure a 99% delivery rate.'
    },
    {
        keyword: 'Lead Generation Strategy',
        slug: 'lead-generation-strategy',
        intentHeadline: 'Winning Lead Generation Strategy',
        contextParagraph: 'Execute a winning lead generation strategy with highly targeted local data lists.'
    }
];

async function seed() {
    console.log('Validating Keywords...');
    for (const kw of keywords) {
        try {
            await db.insert(seoKeywords).values(kw).onConflictDoNothing();
            console.log(`Seeded: ${kw.slug}`);
        } catch (e) {
            console.error(`Failed to seed ${kw.slug}`, e);
        }
    }
    console.log('Seeding complete.');
    process.exit(0);
}

seed();
