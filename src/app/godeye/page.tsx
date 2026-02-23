'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, Terminal, AlertTriangle, ShieldAlert } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function GodEyeTerminal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const [typingText, setTypingText] = useState('');
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Audio Context Synthesizer (No external MP3s needed, browsers allow this after user interaction)
    const playTerminalBeep = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const os = ctx.createOscillator();
            const gain = ctx.createGain();
            os.connect(gain);
            gain.connect(ctx.destination);
            os.type = 'square';
            os.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
            gain.gain.setValueAtTime(0.02, ctx.currentTime); // very quiet beep
            os.start();
            os.stop(ctx.currentTime + 0.05);
        } catch (e) { }
    };

    const playAccessGranted = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const os = ctx.createOscillator();
            const gain = ctx.createGain();
            os.connect(gain);
            gain.connect(ctx.destination);
            os.type = 'sine';
            os.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
            os.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // Slide up
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            os.start();
            os.stop(ctx.currentTime + 1.5);
        } catch (e) { }
    };

    const playAccessDenied = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const os = ctx.createOscillator();
            const gain = ctx.createGain();
            os.connect(gain);
            gain.connect(ctx.destination);
            os.type = 'sawtooth';
            os.frequency.setValueAtTime(150, ctx.currentTime); // Low buzz buzz
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            os.start();
            os.stop(ctx.currentTime + 0.4);

            // Second buzz
            const os2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            os2.connect(gain2);
            gain2.connect(ctx.destination);
            os2.type = 'sawtooth';
            os2.frequency.setValueAtTime(150, ctx.currentTime + 0.5);
            gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.5);
            os2.start(ctx.currentTime + 0.5);
            os2.stop(ctx.currentTime + 0.9);

        } catch (e) { }
    };

    // Matrix Rain Effect (Pure Green)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = "01001011000100110101010101001010101110101010";
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        const drops: number[] = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = accessGranted ? '#fff' : '#0f0'; // Flash white on success
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

        const interval = setInterval(draw, 33);
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

    // Initial Typing sequence
    useEffect(() => {
        const fullText = "CONNECTING TO G.O.D. EYE LAYER...\nESTABLISHING SECURE HANDSHAKE...\nENTER CLEARANCE IDENTITY.";
        let i = 0;
        const intId = setInterval(() => {
            setTypingText(fullText.substring(0, i));
            i++;
            if (i > fullText.length) clearInterval(intId);
        }, 50);
        return () => clearInterval(intId);
    }, []);

    const handleInput = (setter: any, val: string) => {
        setter(val);
        playTerminalBeep();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsAuthenticating(true);
        const toastId = toast.loading('BRUTE FORCING ACCESS LEVEL 5...', {
            style: { background: '#000', color: '#0f0', border: '1px solid #0f0', fontFamily: 'monospace', borderRadius: 0 }
        });

        // Simulate terminal delay
        const t = setTimeout(async () => {
            try {
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    playAccessDenied();
                    toast.error(`ERROR: ${result.error}`, { id: toastId, style: { background: '#000', color: '#f00', border: '1px solid #f00', fontFamily: 'monospace', borderRadius: 0 } });
                    setIsAuthenticating(false);
                } else {
                    playAccessGranted();
                    toast.success('ACCESS GRANTED. GOD EYE ONLINE.', { id: toastId, style: { background: '#0f0', color: '#000', border: '1px solid #0f0', fontFamily: 'monospace', borderRadius: 0, fontWeight: 'bold' } });
                    setAccessGranted(true);

                    // Redirect after suspense
                    setTimeout(() => {
                        router.push('/admin');
                        router.refresh();
                    }, 3000);
                }
            } catch (error) {
                playAccessDenied();
                toast.error('UPLINK SEVERED', { id: toastId });
                setIsAuthenticating(false);
            }
        }, 1500);

        return () => clearTimeout(t);
    };

    return (
        <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-mono selection:bg-[#0f0] selection:text-black">
            <Toaster position="top-center" />

            {/* Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20"></canvas>

            {/* CRT Scanline Overlay class injected via tailwind */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-30"></div>

            <div className={`relative z-10 w-full max-w-2xl p-8 bg-black/90 border-2 ${accessGranted ? 'border-white shadow-[0_0_50px_#fff]' : 'border-[#0f0] shadow-[0_0_30px_#0f0] glow'} transition-all duration-1000`}>

                {/* Hacker header */}
                <div className="flex justify-between items-center border-b-2 border-[#0f0] pb-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Terminal className={`w-8 h-8 ${accessGranted ? 'text-white' : 'text-[#0f0] animate-pulse'}`} />
                        <span className={`text-xl font-bold tracking-widest ${accessGranted ? 'text-white' : 'text-[#0f0]'}`}>
                            g.o.d. eye // terminal_
                        </span>
                    </div>
                    <div>
                        {/* ASCII Eye purely text based */}
                        <pre className={`text-[10px] leading-tight ${accessGranted ? 'text-white shadow-[0_0_10px_#fff] font-bold' : 'text-[#0f0]'}`}>
                            {`  .---.
 / _ _ \\
| (_) |
 \\   /
  '-'`}
                        </pre>
                    </div>
                </div>

                {!accessGranted ? (
                    <div className="space-y-8">
                        <div className="min-h-[80px]">
                            <p className="text-[#0f0] whitespace-pre-line leading-relaxed text-sm">
                                {typingText}
                                <span className="animate-ping inline-block w-2 h-4 bg-[#0f0] ml-1 align-middle"></span>
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 mt-8">
                            <div className="flex flex-col space-y-2 group">
                                <label className="text-[#0f0] flex items-center gap-2 text-xs tracking-widest uppercase">
                                    <ShieldAlert className="w-4 h-4" /> identity:
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleInput(setEmail, e.target.value)}
                                    required
                                    autoComplete="off"
                                    spellCheck="false"
                                    disabled={isAuthenticating}
                                    className="w-full bg-transparent border-b-2 border-[#0f0] py-2 text-[#0f0] placeholder-[#0f0]/30 focus:outline-none focus:border-white transition-all tracking-wider font-bold text-lg disabled:opacity-50"
                                />
                            </div>

                            <div className="flex flex-col space-y-2 group">
                                <label className="text-[#0f0] flex items-center gap-2 text-xs tracking-widest uppercase">
                                    <AlertTriangle className="w-4 h-4" /> token_hash:
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => handleInput(setPassword, e.target.value)}
                                    required
                                    autoComplete="off"
                                    disabled={isAuthenticating}
                                    className="w-full bg-transparent border-b-2 border-[#0f0] py-2 text-[#0f0] placeholder-[#0f0]/30 focus:outline-none focus:border-white transition-all tracking-wider font-bold text-lg disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isAuthenticating}
                                className={`w-full py-4 mt-8 font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 border-2 ${isAuthenticating
                                        ? 'bg-[#0f0] text-black border-[#0f0] cursor-wait animate-pulse'
                                        : 'bg-transparent border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-black hover:shadow-[0_0_20px_#0f0]'
                                    }`}
                            >
                                {isAuthenticating ? 'BYPASSING...' : 'EXECUTE_OVERRIDE'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
                        <Eye className="w-32 h-32 text-white animate-pulse shadow-[0_0_50px_#fff] rounded-full" />
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-widest text-white mb-2">ACCESS GRANTED</h2>
                            <p className="text-white/70 animate-pulse uppercase tracking-widest text-sm text-[#0f0]">Welcome Director. Loading interface...</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .glow {
                    box-shadow: 0 0 10px #0f0, inset 0 0 10px #0f0;
                }
            `}</style>
        </div>
    );
}
