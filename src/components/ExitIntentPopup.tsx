'use client';

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { trackEvent } from '@/lib/tracking';

interface ExitIntentPopupProps {
    city: string;
    keyword: string;
}

export default function ExitIntentPopup({ city, keyword }: ExitIntentPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Phase 14 Attribution Tracking
        localStorage.setItem('dhanda_sourceCity', city);
        localStorage.setItem('dhanda_sourceKeyword', keyword);

        const hasSeenPopup = localStorage.getItem(`exit_intent_${city}_${keyword}`);
        if (hasSeenPopup) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
                setIsVisible(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [city, keyword]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(`exit_intent_${city}_${keyword}`, 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/lead-magnet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, city, keyword }),
            });

            if (res.ok) {
                trackEvent('Lead', { source: 'ExitIntentPopup', city, keyword });
                setIsSuccess(true);
                toast.success('Check your inbox! The free leads are on their way.');
                setTimeout(handleClose, 3000);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_100px_rgba(79,70,229,0.2)] relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
                        <p className="text-slate-300 text-lg">
                            We've sent your 10 free {keyword} to <b>{email}</b>. Go check your inbox!
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-wide mb-6">
                            WAIT! DON'T LEAVE GHOSTED
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            Want 10 Free Verified <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                {keyword}
                            </span> in {city}?
                        </h2>
                        <p className="text-slate-300 mb-8 text-lg">
                            Enter your email below and we'll send you a sample batch of highly-converting DhandaLeads data right now. No credit card required.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Enter your best business email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Send Me The Leads! <Send className="w-5 h-5 ml-1" />
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-slate-500 mt-6">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
