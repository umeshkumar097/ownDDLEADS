'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WelcomeOfferPopupProps {
    emailVerifiedAt: string;
    hasPurchased: boolean;
}

export default function WelcomeOfferPopup({ emailVerifiedAt, hasPurchased }: WelcomeOfferPopupProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Only run on client, avoid hydration mismatch
        if (hasPurchased) return;

        // Check if user has explicitly dismissed this specific session's popup
        const hasDismissed = sessionStorage.getItem('welcome_offer_dismissed');
        if (hasDismissed) return;

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
        if (initialTime) {
            setTimeLeft(initialTime);
            // Delay showing the popup slightly for better UX (500ms after load)
            setTimeout(() => setIsVisible(true), 500);

            const timerId = setInterval(() => {
                const newTime = calculateTimeLeft();
                if (newTime) {
                    setTimeLeft(newTime);
                } else {
                    clearInterval(timerId);
                    setIsVisible(false); // Hide automatically when expired
                }
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [emailVerifiedAt, hasPurchased]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('welcome_offer_dismissed', 'true');
        }, 300); // match animation duration
    };

    const handleClaim = () => {
        // Set a strategic query param that the pricing page can read
        // The backend `/api/checkout/cashfree` will still cryptographically verify 
        // the 24h window constraint before allowing the 50% cut.
        router.push('/pricing?welcome_offer=true');
    };

    if (!isVisible || !timeLeft) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-8 shadow-[0_0_50px_-12px_rgba(245,158,11,0.5)] relative overflow-hidden transition-transform duration-300 ${isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'}`}>
                {/* Premium header accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 animate-pulse"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mx-auto bg-amber-500/10 border border-amber-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                    <Zap className="w-10 h-10 text-amber-500 fill-amber-500" />
                </div>

                <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">
                    Exclusive Welcome Offer
                </h2>
                <div className="text-center mb-8">
                    <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text text-xl font-bold">
                        Get 50% OFF the Starter Package!
                    </span>
                    <p className="text-slate-400 mt-3 max-w-[90%] mx-auto">
                        As a welcome gift, unlock premium features and data points at exactly half the price. This elite offer vanishes once the timer hits zero.
                    </p>
                </div>

                {/* Timer Box */}
                <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-5 mb-8 flex justify-center items-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-mono font-bold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
                            {timeLeft.hours.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">Hours</span>
                    </div>
                    <span className="text-2xl text-amber-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-mono font-bold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
                            {timeLeft.minutes.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">Minutes</span>
                    </div>
                    <span className="text-2xl text-amber-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-mono font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-amber-500 mt-2 font-bold">Seconds</span>
                    </div>
                </div>

                <button
                    onClick={handleClaim}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-3 text-lg group"
                >
                    Claim 50% Discount Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Secure checkout. Offer permanently expires in 24h.
                </div>
            </div>
        </div>
    );
}
