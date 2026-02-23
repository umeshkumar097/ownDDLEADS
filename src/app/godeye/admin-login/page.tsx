'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, Lock, ShieldAlert, Key } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminHackerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const router = useRouter();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const typingAudioRef = useRef<HTMLAudioElement>(null);
    const grantedAudioRef = useRef<HTMLAudioElement>(null);

    // Dynamic Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;':,./<>?";
        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const drops: number[] = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            // Translucent black BG to show trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = accessGranted ? '#10b981' : '#4f46e5'; // Indigo normally, Emerald when granted
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33); // 30fps

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [accessGranted]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Play typing hacker sound
        if (typingAudioRef.current) {
            typingAudioRef.current.currentTime = 0;
            typingAudioRef.current.play().catch(() => { });
        }

        setIsAuthenticating(true);
        const toastId = toast.loading('Bypassing Mainframe Security...', {
            style: { background: '#000', color: '#4f46e5', border: '1px solid #4f46e5', fontFamily: 'monospace' }
        });

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(`ACCESS DENIED: ${result.error}`, { id: toastId, style: { background: '#000', color: '#ef4444', border: '1px solid #ef4444', fontFamily: 'monospace' } });
                setIsAuthenticating(false);

                // Stop typing sound if failed
                if (typingAudioRef.current) {
                    typingAudioRef.current.pause();
                }
            } else {
                toast.success('SECURITY CLEARED. INITIALIZING GOD EYE.', { id: toastId, style: { background: '#000', color: '#10b981', border: '1px solid #10b981', fontFamily: 'monospace' } });
                setAccessGranted(true);

                // Stop typing sound
                if (typingAudioRef.current) {
                    typingAudioRef.current.pause();
                }

                // Play ACCESS GRANTED sound
                if (grantedAudioRef.current) {
                    grantedAudioRef.current.play().catch(() => { });
                }

                // Dramatic pause before redirect
                setTimeout(() => {
                    router.push('/admin');
                    router.refresh();
                }, 2500);
            }
        } catch (error) {
            toast.error('Uplink failed. Retrying.', { id: toastId });
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-mono selection:bg-indigo-500/30">
            <Toaster position="top-center" />

            {/* The Matrix Rain Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40"></canvas>

            {/* Audio Elements via Free Sounds */}
            <audio ref={typingAudioRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_17f7b2434f.mp3" loop />
            <audio ref={grantedAudioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_4966a337ab.mp3?filename=access-granted-101168.mp3" />

            <div className={`relative z-10 w-full max-w-md p-8 bg-black/80 border ${accessGranted ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'border-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.2)]'} backdrop-blur-md rounded-2xl transition-all duration-1000`}>

                <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                    <div className="relative">
                        {accessGranted ? (
                            <div className="absolute inset-0 bg-emerald-500 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                        ) : (
                            <div className="absolute inset-0 bg-indigo-500 blur-2xl rounded-full opacity-30 animate-pulse"></div>
                        )}
                        <Eye className={`w-20 h-20 ${accessGranted ? 'text-emerald-400' : 'text-indigo-400'} relative z-10`} />
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${accessGranted ? 'bg-emerald-300 shadow-[0_0_15px_#10b981]' : 'bg-indigo-300 shadow-[0_0_15px_#4f46e5] animate-ping'} z-20`}></div>
                    </div>
                    <div className="text-center">
                        <h1 className={`text-2xl font-black uppercase tracking-widest ${accessGranted ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {accessGranted ? 'GOD EYE PROTOCOL' : 'SYSTEM OVERRIDE'}
                        </h1>
                        <p className={`text-xs tracking-widest mt-2 ${accessGranted ? 'text-emerald-500/70' : 'text-indigo-500/70'}`}>
                            {accessGranted ? 'CONNECTION ESTABLISHED' : 'AWAITING CLEARANCE LEVEL 5'}
                        </p>
                    </div>
                </div>

                {!accessGranted ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center">
                                    <ShieldAlert className="absolute left-4 w-5 h-5 text-indigo-500" />
                                    <input
                                        type="email"
                                        placeholder="DIRECTOR ID (EMAIL)"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-black border border-indigo-500/30 rounded-xl py-4 pl-12 pr-4 text-indigo-100 placeholder-indigo-500/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all uppercase tracking-wider text-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center">
                                    <Key className="absolute left-4 w-5 h-5 text-indigo-500" />
                                    <input
                                        type="password"
                                        placeholder="ENCRYPTION KEY"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-black border border-indigo-500/30 rounded-xl py-4 pl-12 pr-4 text-indigo-100 placeholder-indigo-500/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all tracking-wider text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 border ${isAuthenticating
                                    ? 'bg-indigo-900 border-indigo-500 text-indigo-300 cursor-not-allowed cursor-wait'
                                    : 'bg-transparent border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-black hover:shadow-[0_0_20px_#4f46e5]'
                                }`}
                        >
                            {isAuthenticating ? (
                                <>
                                    <Lock className="w-5 h-5 animate-pulse" /> DECRYPTING...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" /> INITIATE BREACH
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="w-full flex flex-col space-y-2">
                            <div className="h-1 w-full bg-emerald-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 animate-[progress_2s_ease-in-out_forwards]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-emerald-500 tracking-widest font-bold">
                                <span>INITIALIZING SERVERS</span>
                                <span>100%</span>
                            </div>
                        </div>
                        <p className="text-emerald-400 animate-pulse tracking-widest uppercase text-sm font-bold text-center">
                            Welcome back, Director.<br />Routing you to the God Eye Layer.
                        </p>
                    </div>
                )}
            </div>

            {/* Visual scanline overlay */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
        </div>
    );
}
