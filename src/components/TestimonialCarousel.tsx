'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Director of Sales, TechCorp India",
    image: "https://i.pravatar.cc/150?img=11",
    content: "DhandaLeads completely changed how we prospect. Finding verified decision-makers in specific Indian cities used to take hours. Now it takes 60 seconds. Our connect rate went up by 40%.",
  },
  {
    name: "Priya Patel",
    role: "Founder, ScaleUp Agency",
    image: "https://i.pravatar.cc/150?img=5",
    content: "The WhatsApp outreach feature is a game-changer. We skip the cold email spam folder and get straight into the prospect's DMs. Zero-bounce refund gives me total peace of mind.",
  },
  {
    name: "Amit Desai",
    role: "VP Marketing, BuildRight Real Estate",
    image: "https://i.pravatar.cc/150?img=8",
    content: "We use the B2B local search to find contractors and architects. The data freshness is incredible. It feels like having an army of data researchers working for you 24/7.",
  },
  {
    name: "Sneha Reddy",
    role: "Growth Head, SaaSify",
    image: "https://i.pravatar.cc/150?img=9",
    content: "I've tried Apollo and Lusha, but for the Indian market, DhandaLeads is vastly superior. The pricing is transparent and the data accuracy for tier-2 cities is unmatched.",
  },
  {
    name: "Vikram Singh",
    role: "Managing Partner, LegalAssociates",
    image: "https://i.pravatar.cc/150?img=12",
    content: "Generating corporate clients was always a challenge. Using DhandaLeads, we built a targeted list of manufacturing SMEs and closed 3 retainer accounts in our first week.",
  }
];

export default function TestimonialCarousel() {
  return (
    <div className="relative flex overflow-x-hidden group">
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#05060f] to-transparent z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#05060f] to-transparent z-10" />
      
      <div className="flex animate-marquee group-hover:pause space-x-6">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div 
            key={i} 
            className="w-[400px] shrink-0 p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all"
          >
            <div className="flex gap-1 text-emerald-400 mb-6">
              {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">"{t.content}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-800 relative">
                <Image src={t.image} alt={t.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white">{t.name}</h4>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
