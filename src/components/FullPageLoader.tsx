import { Activity } from 'lucide-react';
import Image from 'next/image';

export default function FullPageLoader({ message = "Authenticating Command Center..." }: { message?: string }) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans space-y-8">
            <div className="relative flex items-center justify-center">
                {/* Glowing animated background */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse w-32 h-32 -m-10 mx-auto"></div>

                {/* Core spinner / icon */}
                <div className="relative z-10 bg-slate-900 border border-indigo-500/30 p-5 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                    <Image src="/icon.png" width={48} height={48} alt="Loading" className="w-12 h-12 object-contain animate-pulse" />
                </div>
            </div>

            <div className="space-y-3 text-center">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    {message}
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
