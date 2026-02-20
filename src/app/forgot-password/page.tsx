'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending reset link...');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                toast.success('Reset link sent!', { id: toastId });
                setSubmitted(true);
            } else {
                toast.error('Failed to send reset link.', { id: toastId });
            }
        } catch (err) {
            toast.error('An unexpected error occurred.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white font-sans selection:bg-indigo-500/30 px-6">
            <Toaster position="bottom-right" />
            <Link href="/">
                <img src="/logo.png" alt="DhandaLeads" className="h-10 w-auto mb-12 hover:opacity-80 transition cursor-pointer" />
            </Link>

            <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full shadow-xl">
                {!submitted ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                            <p className="text-slate-400 text-sm">Enter your email address to receive a secure password reset link.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="hello@company.com" />
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-4 flex justify-center items-center gap-2">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
                        <p className="text-slate-400 text-sm mb-8">We've sent a password reset link to <span className="text-white font-medium">{email}</span>. The link will expire in 1 hour.</p>
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-slate-400">
                    Remember your password? <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300">Log in</Link>
                </div>
            </div>
        </div>
    );
}
