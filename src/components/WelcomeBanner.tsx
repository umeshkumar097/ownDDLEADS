'use client';

import { useState, useEffect } from 'react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WelcomeBannerProps {
    emailVerifiedAt: string;
    hasPurchased: boolean;
}

export default function WelcomeBanner({ emailVerifiedAt, hasPurchased }: WelcomeBannerProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        if (hasPurchased) return;

        const verifiedDate = new Date(emailVerifiedAt).getTime();
        const expiryDate = verifiedDate + (24 * 60 * 60 * 1000); // 24 hours later

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = expiryDate - now;

            if (difference <= 0) {
                return null;
            }

            return {
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };

        const initialTime = calculateTimeLeft();
        if (initialTime) setTimeLeft(initialTime);

        const timerId = setInterval(() => {
            const newTime = calculateTimeLeft();
            if (newTime) {
                setTimeLeft(newTime);
            } else {
                clearInterval(timerId);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [emailVerifiedAt, hasPurchased]);

    if (!timeLeft || hasPurchased) return null;

    return (
        <div className="w-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white shadow-lg overflow-hidden relative group hidden sm:block">
            {/* Animated shimmer overlay */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer transition-all duration-1000 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4 text-sm font-medium z-10 relative">
                <Tag className="w-4 h-4 hidden md:block" />
                <span className="font-bold tracking-tight">NEW USER DEAL:</span>
                <span>Unlock your first B2B data package at <strong className="font-black bg-black/20 px-2 py-0.5 rounded text-amber-100">50% OFF!</strong></span>

                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-md shadow-inner border border-white/10 ml-2">
                    <Clock className="w-4 h-4 text-amber-200 animate-pulse" />
                    <span className="font-mono font-bold w-[75px] text-center">
                        {timeLeft.hours.toString().padStart(2, '0')}:
                        {timeLeft.minutes.toString().padStart(2, '0')}:
                        {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                </div>

                <Link href="/pricing?welcome_offer=true" className="ml-4 flex items-center gap-1 bg-white text-orange-600 hover:bg-amber-100 px-4 py-1.5 rounded-full font-bold shadow-[0_4px_10px_-2px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 text-xs">
                    Claim Discount <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
