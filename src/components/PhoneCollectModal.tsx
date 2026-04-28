'use client';

import { useState } from 'react';
import { Phone, ArrowRight, AlertCircle } from 'lucide-react';

interface PhoneCollectModalProps {
    onSubmit: (phone: string) => Promise<void>;
    userName?: string;
}

export default function PhoneCollectModal({ onSubmit, userName }: PhoneCollectModalProps) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validatePhone = (val: string) => /^[6-9]\d{9}$/.test(val.replace(/\s/g, ''));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = phone.replace(/\s/g, '');
        if (!validatePhone(cleaned)) {
            setError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await onSubmit(cleaned);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-indigo-500" />

                <div className="p-8">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 mx-auto">
                        <Phone className="w-7 h-7 text-emerald-400" />
                    </div>

                    <h2 className="text-xl font-extrabold text-white text-center mb-2">
                        One Last Step{userName ? `, ${userName.split(' ')[0]}` : ''}!
                    </h2>
                    <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
                        Please add your mobile number to complete your account setup. We'll never spam you.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                                    <span className="text-sm font-medium">🇮🇳 +91</span>
                                    <span className="w-px h-5 bg-white/10" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        setPhone(val);
                                        setError('');
                                    }}
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-24 pr-4 py-3.5 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-rose-400 text-xs mt-2">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phone.length < 10}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Continue to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-600 mt-4">
                        🔒 Your number is encrypted and never shared.
                    </p>
                </div>
            </div>
        </div>
    );
}
