'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Mail, ShieldAlert, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResend = async () => {
        setLoading(true);
        const toastId = toast.loading('Initiating secure SMTP connection...');
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Verification email sent! Please check your inbox and spam folders.', { id: toastId, duration: 5000 });
            } else {
                toast.error(data.error || 'Failed to dispatch email.', { id: toastId });
            }
        } catch (err) {
            toast.error('An unexpected network error occurred.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-slate-400 animate-pulse font-mono text-sm tracking-widest uppercase">Checking Authorization...</p></div>;

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans px-4">
            <Toaster position="bottom-right" />
            <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl"></div>

                <ShieldAlert className="w-16 h-16 text-rose-400 mx-auto mb-6 relative z-10" />
                <h1 className="text-3xl font-extrabold text-white mb-4 relative z-10 tracking-tight">Access Locked</h1>
                <p className="text-slate-400 mb-8 relative z-10 leading-relaxed text-sm">
                    You must verify your email address to unlock the DhandaLeads Command Center. Please check your inbox or spam folder for the activation link.
                </p>

                <div className="space-y-4 relative z-10">
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
                    >
                        {loading ? 'Dispatching...' : <><Mail className="w-5 h-5" /> Resend Verification Email</>}
                    </button>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 border border-white/5"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
