import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'DhandaLeads | B2B Lead Generation India — Verified Business Contacts',
  description: "India's #1 B2B lead generation platform. Discover verified business emails, phone numbers & decision-maker contacts across 100+ Indian cities. Trusted by 500+ entrepreneurs.",
  keywords: ['B2B lead generation India', 'verified business leads', 'buy business contacts India', 'lead generation company India', 'WhatsApp leads India', 'Aiclex Technologies'],
  alternates: {
    canonical: 'https://dhandaleads.com',
  },
  openGraph: {
    title: 'DhandaLeads | B2B Lead Generation India',
    description: "India's #1 B2B lead generation platform. 500+ verified business contacts at your fingertips.",
    url: 'https://dhandaleads.com',
    type: 'website',
  }
};

export default function Home() {
  return <HomeClient />;
}
