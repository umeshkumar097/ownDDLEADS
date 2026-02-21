'use client';

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            return toast.error("Missing reset token.");
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        if (formData.password.length < 8) {
            return toast.error("Password must be at least 8 characters.");
        }

        setLoading(true);
        const toastId = toast.loading('Resetting password...');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: formData.password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password reset successfully!', { id: toastId });
                setSuccess(true);
                setTimeout(() => router.push('/login'), 3000);
            } else {
                toast.error(data.error || 'Failed to reset password.', { id: toastId });
            }
        } catch (err) {
            toast.error('An unexpected error occurred.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white px-6">
                <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-rose-400 mb-4">Invalid Request</h2>
                    <p className="text-slate-400 mb-6">No reset token was provided in the URL.</p>
                    <Link href="/forgot-password" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl transition font-medium">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white font-sans selection:bg-indigo-500/30 px-6">
            <Toaster position="bottom-right" />
            <Link href="/">
                <Image src="/logo.png" width={160} height={40} alt="DhandaLeads" className="h-10 w-auto mb-12 hover:opacity-80 transition cursor-pointer" />
            </Link>

            <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full shadow-xl">
                {!success ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
                            <p className="text-slate-400 text-sm">Your new password must be uniquely different from your previous ones.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-6 flex justify-center items-center gap-2">
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2 text-emerald-400">Password Reset Complete</h2>
                        <p className="text-slate-400 text-sm">Your password has been changed successfully. Redirecting you to login...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
