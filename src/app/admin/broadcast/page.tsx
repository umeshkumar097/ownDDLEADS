'use client';

import { useState } from 'react';
import { Megaphone, AlertCircle, Save, Loader2, Clock } from 'lucide-react';
import { setGlobalBroadcast } from '../actions';
import toast, { Toaster } from 'react-hot-toast';

export default function BroadcastPage() {
    const [message, setMessage] = useState('');
    const [hours, setHours] = useState(24);
    const [loading, setLoading] = useState(false);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            return toast.error("Broadcast message cannot be empty.");
        }

        setLoading(true);
        const toastId = toast.loading("Publishing Global Broadcast...");

        try {
            await setGlobalBroadcast(message, hours);
            toast.success("Broadcast goes LIVE instantly across all dashboards!", { id: toastId });
            setMessage('');
        } catch (error) {
            toast.error("Failed to publish broadcast. Unauthorized?", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Toaster position="bottom-right" />

            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Megaphone className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Global Broadcast</h1>
                    <p className="text-slate-400 mt-1">Push alerts, promos, or server updates live to every user's dashboard.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start gap-4 mb-8">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-white text-lg">Warning: Instant Delivery</h3>
                        <p className="text-sm text-slate-400 mt-1">This message will bypass email and appear as a persistent banner at the top of every active user's dashboard until the duration expires or a new broadcast overwrites it.</p>
                    </div>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Message Body</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="e.g. 🔥 Flash Sale! Get 50 Extra Credits when you buy the Pro Pack today!"
                            className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2 text-right">{message.length} chars</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Duration to stay active
                        </label>
                        <select
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="w-full md:w-64 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                            <option value={1}>1 Hour (Emergency Alert)</option>
                            <option value={12}>12 Hours (Daily Promo)</option>
                            <option value={24}>24 Hours (Standard)</option>
                            <option value={72}>3 Days (Weekend Sale)</option>
                            <option value={168}>1 Week (Major Announcement)</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button
                            disabled={loading || !message.trim()}
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Publish to Live Deployments
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
