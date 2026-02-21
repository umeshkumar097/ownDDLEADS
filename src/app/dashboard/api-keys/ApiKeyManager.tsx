'use client';

import { useState } from 'react';
import { generateApiKey, revokeApiKey } from './actions';
import { KeyRound, RefreshCcw, Trash2, CheckCircle2 } from 'lucide-react';

export default function ApiKeyManager({ hasKey, lastUsed, createdAt }: { hasKey: boolean, lastUsed?: Date | null, createdAt?: Date | null }) {
    const [loading, setLoading] = useState(false);
    const [secretToken, setSecretToken] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const res = await generateApiKey();
        setLoading(false);
        if (res.token) {
            setSecretToken(res.token);
            setShowConfirm(false);
            window.location.reload(); // naive reload to refresh state after showing token
        } else {
            alert(res.error);
        }
    };

    const handleRevoke = async () => {
        setLoading(true);
        const res = await revokeApiKey();
        setLoading(false);
        if (res.success) {
            window.location.reload();
        } else {
            alert(res.error);
        }
    };

    if (secretToken) {
        return (
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-lg text-center animate-fade-in-up">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">API Secret Generated</h3>
                <p className="text-slate-300 mb-6">Store this token securely right now. You will never be able to see it again.</p>
                <div className="bg-black/50 p-4 rounded-lg border border-white/10 select-all font-mono text-emerald-400 text-lg mb-6 break-all">
                    {secretToken}
                </div>
                <button onClick={() => setSecretToken(null)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm font-bold">
                    I Have Saved It Securely
                </button>
            </div>
        );
    }

    if (!hasKey) {
        return (
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
            >
                <KeyRound className="w-5 h-5" />
                {loading ? 'Generating...' : 'Generate Secret Key'}
            </button>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div className="text-sm text-slate-500 mb-1">Status</div>
                    <div className="text-emerald-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Active</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div className="text-sm text-slate-500 mb-1">Created on</div>
                    <div className="text-slate-200 font-bold">{createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}</div>
                </div>
            </div>

            {showConfirm ? (
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg animate-fade-in text-center">
                    <h4 className="text-lg font-bold text-white mb-2">Are you absolutely sure?</h4>
                    <p className="text-slate-300 text-sm mb-6">Any applications currently using this secret token will immediately lose access and be disconnected.</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handleRevoke} disabled={loading} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">
                            {loading ? 'Revoking...' : 'Yes, Revoke Key'}
                        </button>
                        <button onClick={() => setShowConfirm(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors text-sm"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Regenerate Key
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-500 border border-red-900/50 rounded-lg font-bold transition-colors text-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Revoke Access
                    </button>
                </div>
            )}
        </div>
    );
}
