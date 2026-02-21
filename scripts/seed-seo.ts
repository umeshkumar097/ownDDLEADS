import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { seoCities, seoKeywords } from '../src/db/schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const TOP_100_CITIES = [
    { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra' },
    { name: 'Delhi', slug: 'delhi', state: 'Delhi' },
    { name: 'Bangalore', slug: 'bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana' },
    { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat' },
    { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal' },
    { name: 'Surat', slug: 'surat', state: 'Gujarat' },
    { name: 'Pune', slug: 'pune', state: 'Maharashtra' },
    { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan' },
    { name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh' },
    { name: 'Kanpur', slug: 'kanpur', state: 'Uttar Pradesh' },
    { name: 'Nagpur', slug: 'nagpur', state: 'Maharashtra' },
    { name: 'Indore', slug: 'indore', state: 'Madhya Pradesh' },
    { name: 'Thane', slug: 'thane', state: 'Maharashtra' },
    { name: 'Bhopal', slug: 'bhopal', state: 'Madhya Pradesh' },
    { name: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Pimpri-Chinchwad', slug: 'pimpri-chinchwad', state: 'Maharashtra' },
    { name: 'Patna', slug: 'patna', state: 'Bihar' },
    { name: 'Vadodara', slug: 'vadodara', state: 'Gujarat' },
    { name: 'Ghaziabad', slug: 'ghaziabad', state: 'Uttar Pradesh' },
    { name: 'Ludhiana', slug: 'ludhiana', state: 'Punjab' },
    { name: 'Agra', slug: 'agra', state: 'Uttar Pradesh' },
    { name: 'Nashik', slug: 'nashik', state: 'Maharashtra' },
    { name: 'Faridabad', slug: 'faridabad', state: 'Haryana' },
    { name: 'Meerut', slug: 'meerut', state: 'Uttar Pradesh' },
    { name: 'Rajkot', slug: 'rajkot', state: 'Gujarat' },
    { name: 'Kalyan-Dombivli', slug: 'kalyan-dombivli', state: 'Maharashtra' },
    { name: 'Vasai-Virar', slug: 'vasai-virar', state: 'Maharashtra' },
    { name: 'Varanasi', slug: 'varanasi', state: 'Uttar Pradesh' },
    { name: 'Srinagar', slug: 'srinagar', state: 'Jammu & Kashmir' },
    { name: 'Aurangabad', slug: 'aurangabad', state: 'Maharashtra' },
    { name: 'Dhanbad', slug: 'dhanbad', state: 'Jharkhand' },
    { name: 'Amritsar', slug: 'amritsar', state: 'Punjab' },
    { name: 'Navi Mumbai', slug: 'navi-mumbai', state: 'Maharashtra' },
    { name: 'Allahabad', slug: 'allahabad', state: 'Uttar Pradesh' },
    { name: 'Howrah', slug: 'howrah', state: 'West Bengal' },
    { name: 'Ranchi', slug: 'ranchi', state: 'Jharkhand' },
    { name: 'Gwalior', slug: 'gwalior', state: 'Madhya Pradesh' },
    { name: 'Jabalpur', slug: 'jabalpur', state: 'Madhya Pradesh' },
    { name: 'Coimbatore', slug: 'coimbatore', state: 'Tamil Nadu' },
    { name: 'Vijayawada', slug: 'vijayawada', state: 'Andhra Pradesh' },
    { name: 'Jodhpur', slug: 'jodhpur', state: 'Rajasthan' },
    { name: 'Madurai', slug: 'madurai', state: 'Tamil Nadu' },
    { name: 'Raipur', slug: 'raipur', state: 'Chhattisgarh' },
    { name: 'Kota', slug: 'kota', state: 'Rajasthan' },
    { name: 'Chandigarh', slug: 'chandigarh', state: 'Chandigarh' },
    { name: 'Guwahati', slug: 'guwahati', state: 'Assam' },
    { name: 'Solapur', slug: 'solapur', state: 'Maharashtra' },
    { name: 'Hubli-Dharwad', slug: 'hubli-dharwad', state: 'Karnataka' },
    { name: 'Noida', slug: 'noida', state: 'Uttar Pradesh' }, // Explicitly requested
    { name: 'Gurgaon', slug: 'gurgaon', state: 'Haryana' } // Explicitly requested
];

const TARGET_KEYWORDS = [
    {
        keyword: 'Lead Generation Tools',
        slug: 'lead-generation-tools',
        intentHeadline: 'Top Rated B2B Lead Generation Tools',
        contextParagraph: 'Leverage the most advanced AI-driven lead generation tools to fully automate your outbound sales pipeline and discover highly verified emails and LinkedIn profiles instantly.'
    },
    {
        keyword: 'Lead Generation Company',
        slug: 'lead-generation-company',
        intentHeadline: 'The #1 B2B Lead Generation Company',
        contextParagraph: 'Partner with the leading data experts who supply hyper-targeted, high-converting B2B prospects specifically tailored for growing businesses and enterprise sales teams.'
    },
    {
        keyword: 'Lead Generation Meaning',
        slug: 'lead-generation-meaning',
        intentHeadline: 'Understanding True Lead Generation',
        contextParagraph: 'Lead generation is the crucial process of identifying, attracting, and converting strangers into highly qualified prospects who are actively interested in your product or service offerings.'
    },
    {
        keyword: 'Lead Generation GPT',
        slug: 'lead-generation-gpt',
        intentHeadline: 'AI-Powered Lead Generation GPT',
        contextParagraph: 'Deploy cutting-edge generative AI models and GPT logic to automatically analyze markets, craft personalized icebreakers, and extract intent-rich data at scale.'
    },
    {
        keyword: 'Lead Generation World',
        slug: 'lead-generation-world',
        intentHeadline: 'Navigate the Lead Generation World',
        contextParagraph: 'Stay ahead of the competition in the fast-paced lead generation world by tapping into our proprietary, continuously updated global database of decision-makers.'
    },
    {
        keyword: 'Lead Generation Specialist',
        slug: 'lead-generation-specialist',
        intentHeadline: 'Hire a Top Lead Generation Specialist',
        contextParagraph: 'Our platform acts as your dedicated virtual lead generation specialist, working 24/7 to hunt down exact ICP matches and funnel qualified contacts straight to your CRM.'
    },
    {
        keyword: 'Lead Generation Process',
        slug: 'lead-generation-process',
        intentHeadline: 'A Flawless Lead Generation Process',
        contextParagraph: 'Streamline your chaotic sales workflow with a structured, step-by-step lead generation process designed to guarantee higher deliverability and faster conversion rates.'
    },
    {
        keyword: 'Lead Generation Strategy',
        slug: 'lead-generation-strategy',
        intentHeadline: 'Winning B2B Lead Generation Strategy',
        contextParagraph: 'Stop guessing and start scaling. Implement a proven outbound lead generation strategy powered by intent signals and highly accurate direct dial phone numbers.'
    }
];

async function seed() {
    console.log('Seeding SEO tables...');
    try {
        const existingCities = await db.select().from(seoCities);
        if (existingCities.length === 0) {
            await db.insert(seoCities).values(TOP_100_CITIES);
            console.log(`✅ Seeded ${TOP_100_CITIES.length} cities.`);
        } else {
            console.log(`ℹ️ Cities already seeded (${existingCities.length} found).`);
        }

        const existingKeywords = await db.select().from(seoKeywords);
        if (existingKeywords.length === 0) {
            await db.insert(seoKeywords).values(TARGET_KEYWORDS);
            console.log(`✅ Seeded ${TARGET_KEYWORDS.length} keywords.`);
        } else {
            console.log(`ℹ️ Keywords already seeded (${existingKeywords.length} found).`);
        }

        console.log('🎉 Seeding complete.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed().catch(console.error);
