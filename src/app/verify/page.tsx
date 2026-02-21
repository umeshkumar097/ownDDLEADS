'use client';

import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Verifying...</div>}>
            <VerifyContent />
        </Suspense>
    );
}

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const token = searchParams?.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully! Redirecting exactly in 3 seconds...');
                    setTimeout(() => router.push('/login?verified=true'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An unexpected error occurred.');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white font-sans selection:bg-indigo-500/30 px-6">
            <Link href="/">
                <Image src="/logo.png" width={160} height={40} alt="DhandaLeads" className="h-10 w-auto mb-12 hover:opacity-80 transition cursor-pointer" />
            </Link>

            <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-md w-full text-center shadow-xl">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                        <h2 className="text-2xl font-bold">Verifying Email</h2>
                        <p className="text-slate-400">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-emerald-400">Verified!</h2>
                        <p className="text-slate-400">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-rose-400" />
                        <h2 className="text-2xl font-bold text-rose-400">Verification Failed</h2>
                        <p className="text-slate-400 mb-6">{message}</p>
                        <Link href="/register" className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition font-medium">
                            Back to Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
