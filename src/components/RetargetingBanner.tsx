'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, X } from 'lucide-react';

export default function RetargetingBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Run only on client
        if (typeof window !== 'undefined') {
            const visitedPricing = localStorage.getItem('visited_pricing') === 'true';
            const hasPurchased = localStorage.getItem('has_purchased') === 'true';
            // Also ensure we don't nag them forever if they dismiss
            const dismissed = localStorage.getItem('retargeting_dismissed') === 'true';

            // Give a delay so it pops up after a few seconds of browsing to capture attention
            if (visitedPricing && !hasPurchased && !dismissed) {
                const timer = setTimeout(() => setIsVisible(true), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white shadow-xl relative z-50 animate-fade-in-down border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="hidden sm:block bg-white/20 p-2 rounded-full shrink-0">
                        <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold flex items-center justify-center sm:justify-start gap-2">
                            Wait! Claim your Secret 20% Discount. <span className="text-xl">🔥</span>
                        </p>
                        <p className="text-sm text-emerald-100 hidden sm:block">
                            Because you checked out our pricing earlier, we've unlocked a hidden discount tier just for you.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <Link
                        href="/pricing?welcome_offer=true"
                        onClick={() => {
                            setIsVisible(false);
                            localStorage.setItem('retargeting_dismissed', 'true');
                        }}
                        className="bg-white text-emerald-900 font-bold px-6 py-2 rounded-full hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap text-sm sm:text-base animate-pulse"
                    >
                        Claim Offer Now
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.setItem('retargeting_dismissed', 'true');
                            setIsVisible(false);
                        }}
                        className="text-emerald-200 hover:text-white transition-colors"
                        aria-label="Dismiss offer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
