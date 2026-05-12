'use client';

import { useState } from 'react';
import { Mail, Send, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BulkEmailDialogProps {
    selectedUserIds: string[];
    onClose: () => void;
}

export default function BulkEmailDialog({ selectedUserIds, onClose }: BulkEmailDialogProps) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('Hi {name},\n\nWe noticed you haven\'t started using DhandaLeads to its full potential yet. Use code SAVE20 for an extra discount on your next top-up!\n\nBest,\nGrowth Team');
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState<{ success: number; failed: number } | null>(null);

    const handleSend = async () => {
        if (!subject || !body) return toast.error("Subject and Body are required.");
        
        setIsSending(true);
        const toastId = toast.loading(`Sending emails to ${selectedUserIds.length} users...`);
        
        try {
            const res = await fetch('/api/admin/bulk-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: selectedUserIds, subject, body })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message, { id: toastId });
                setProgress(data.summary);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                toast.error(data.error || "Failed to send emails", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred during bulk sending", { id: toastId });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Mail className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bulk Outreach</h2>
                            <p className="text-slate-400 text-sm">Targeting {selectedUserIds.length} selected users</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 ml-1">Email Subject</label>
                        <input
                            type="text"
                            placeholder="Special Offer for you!"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-semibold text-slate-400">Message Body</label>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">Use {`{name}`} for personalization</span>
                        </div>
                        <textarea
                            rows={8}
                            placeholder="Write your offer message here..."
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                        />
                    </div>

                    {progress && (
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm text-slate-300">Sent: {progress.success}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-400" />
                                <span className="text-sm text-slate-300">Failed: {progress.failed}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending || selectedUserIds.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" /> Blast Emails
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
