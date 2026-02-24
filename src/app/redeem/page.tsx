'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Gift, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function RedeemPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [licenseKey, setLicenseKey] = useState('');
    const [isRedeeming, setIsRedeeming] = useState(false);

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status === 'unauthenticated') {
            toast.error('Please login or register to redeem your code.');
            return;
        }

        if (!licenseKey.trim()) {
            toast.error('Please enter a valid AppSumo license key.');
            return;
        }

        setIsRedeeming(true);
        const toastId = toast.loading('Verifying license key securely...');

        try {
            const res = await fetch('/api/appsumo/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseKey })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Success! Tier ${data.tierLevel} Activated. You received ${data.awardedCredits.toLocaleString()} credits.`, { id: toastId, duration: 6000 });
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                toast.error(data.error || 'Failed to redeem code.', { id: toastId });
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.', { id: toastId });
        } finally {
            setIsRedeeming(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-yellow-500/30">
            <Navbar />
            <Toaster position="top-center" />

            <main className="flex-1 flex flex-col items-center justify-center py-20 px-6">

                <div className="max-w-xl w-full text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold tracking-wide uppercase mb-6 border border-yellow-200 shadow-sm">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> AppSumo Exclusive Partner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Redeem Lifetime Deal</h1>
                    <p className="text-slate-600 text-lg">Claim your premium lifetime access by entering your unique AppSumo license key below.</p>
                </div>

                <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

                    <form onSubmit={handleRedeem} className="space-y-6">
                        {status === 'unauthenticated' && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                                <span>You must be signed in to apply a license key to your account.</span>
                                <Link href="/register" className="font-bold underline ml-auto shrink-0">Register Now</Link>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Gift className="w-4 h-4 text-yellow-500" /> Enter License Key
                            </label>
                            <input
                                type="text"
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value)}
                                placeholder="AS-XXXX-XXXX-XXXX"
                                required
                                disabled={isRedeeming || status === 'unauthenticated'}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-4 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isRedeeming || status === 'unauthenticated' || !licenseKey}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-500/20 text-lg ${isRedeeming || status === 'unauthenticated' || !licenseKey
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 hover:-translate-y-1'
                                }`}
                        >
                            {isRedeeming ? 'Authenticating...' : 'Unlock Lifetime Access'}
                            {!isRedeeming && <ArrowRight className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>100% Encrypted & Automatic Activation</span>
                        </div>
                    </form>
                </div>

            </main>

            <Footer />
        </div>
    );
}
