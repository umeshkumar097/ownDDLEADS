'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function GodEyeLogin() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-mono tracking-widest text-sm uppercase">Loading Secured Node...</div>}>
            <GodEyeContent />
        </Suspense>
    );
}

function GodEyeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Eye tracking state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (searchParams?.get('error') === 'SessionExpired') {
            toast.error("God Eye access requires Admin privileges.");
        }

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [searchParams]);

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
            toast.error("Access Denied.", { id: toastId });
            setLoading(false);
        } else {
            toast.success('Access Granted.', { id: toastId });
            router.push('/admin');
        }
    };

    // Calculate eye pupil position
    // Center of the screen approximation for the eye
    const getPupilTransform = (eyeCenterX: number, eyeCenterY: number) => {
        const deltaX = mousePos.x - eyeCenterX;
        const deltaY = mousePos.y - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(12, Math.hypot(deltaX, deltaY) / 10); // Max pupil movement radius is 12px

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        return `translate(${pupilX}px, ${pupilY}px)`;
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono selection:bg-emerald-500/30 overflow-hidden relative">
            <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' } }} />

            {/* Background Grid & Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-full w-full animate-pulse opacity-20 pointer-events-none" style={{ animationDuration: '4s' }}></div>

            <div className="z-10 flex flex-col items-center justify-center w-full max-w-sm px-6">

                {/* The God Eye Graphic */}
                <div className="relative mb-6">
                    <div className="w-24 h-12 bg-black border-2 border-emerald-500 rounded-[100%] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative overflow-hidden group">
                        {/* Eye pupil container */}
                        <div
                            className="w-8 h-8 rounded-full border border-emerald-400 bg-emerald-900/50 flex items-center justify-center transition-transform duration-75 ease-out"
                            style={{ transform: isMounted && typeof window !== 'undefined' ? getPupilTransform(window.innerWidth / 2, window.innerHeight / 2 - 120) : 'none' }}
                        >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-black text-emerald-500 tracking-[0.3em] uppercase mb-1 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">God Eye</h1>
                <p className="text-emerald-900 text-xs mb-8 tracking-widest font-bold">SYSTEM OVERRIDE TERMINAL</p>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/10 blur group-hover:bg-emerald-500/20 transition-all rounded-none"></div>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="relative w-full bg-black/50 border border-emerald-900 px-4 py-3 text-emerald-400 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-colors rounded-none text-sm tracking-widest"
                            placeholder="ADMIN IDENTITY"
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/10 blur group-hover:bg-emerald-500/20 transition-all rounded-none"></div>
                        <input
                            required
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="relative w-full bg-black/50 border border-emerald-900 px-4 py-3 text-emerald-400 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-colors rounded-none text-sm tracking-widest"
                            placeholder="AUTHORIZATION KEY"
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500 disabled:opacity-50 text-emerald-500 hover:text-black font-bold py-3 transition-all duration-300 flex justify-center items-center gap-2 mt-8 tracking-widest text-sm uppercase">
                        {loading ? 'Decrypting...' : <>Initialize <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-12 text-[10px] text-emerald-900 flex justify-between w-full uppercase tracking-widest">
                    <span>AICLEX.DEV</span>
                    <span>RESTRICTED NODE</span>
                </div>
            </div>
        </div>
    );
}
