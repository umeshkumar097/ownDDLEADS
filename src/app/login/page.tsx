'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (searchParams?.get('registered') === 'true') {
            toast.success("Registration successful! Please login.");
        }
        if (searchParams?.get('verified') === 'true') {
            toast.success("Email verified successfully! You can now login.");
        }
        if (searchParams?.get('error') === 'CredentialsSignin') {
            toast.error("Invalid email or password.");
        }
        if (searchParams?.get('error') === 'SessionExpired') {
            toast.error("Admin session required. Please log in.");
        }
        if (searchParams?.get('error') === 'OAuthAccountNotLinked') {
            toast.error("To confirm your identity, please sign in with the same account you used originally (e.g., Email & Password).", { duration: 6000 });
        }
    }, [searchParams]);

    useEffect(() => {
        if (status === 'authenticated') {
            console.warn("User is somehow already authenticated on the Login page! Payload:", session);
            // We used to redirect from here in older versions, but the code doesn't explicitly do it now.
            // If the flicker was caused by a higher-level HOC, or if it's NEXT_AUTH itself caching.
        }
    }, [status, session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Authenticating...');

        const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });

        if (result?.error) {
            toast.error(result.error, { id: toastId });
            setLoading(false);
        } else {
            toast.success('Login successful!', { id: toastId });
            // Clean up the URL in case the user arrived here with query params previously
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-indigo-500/30">
            <Toaster position="bottom-right" />

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <div className="max-w-md w-full mx-auto">
                    <Link href="/">
                        <Image src="/logo.png" width={160} height={40} alt="DhandaLeads" className="h-10 w-auto mb-12 hover:opacity-80 transition cursor-pointer" />
                    </Link>

                    <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 mb-8">Login to your command center.</p>

                    <form onSubmit={handleLogin} method="POST" className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="hello@company.com" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-400">Password</label>
                                <Link href="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 text-center mt-4 mb-2">
                            By logging in, you agree to our <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Use</Link> and <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
                        </div>

                        <button disabled={loading || !mounted} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-6 flex justify-center items-center gap-2">
                            {loading ? 'Authenticating...' : <>Log In <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account? <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Visual / Graphic */}
            <div className="hidden lg:flex w-1/2 bg-black/50 p-12 flex-col justify-center relative overflow-hidden items-center border-l border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl shadow-indigo-500/10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Credits</p>
                            <p className="text-4xl font-black text-indigo-400">1,250</p>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg font-bold border border-emerald-500/20">
                            Active Plan
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                        <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                        <div className="h-4 bg-slate-800 rounded-full w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
