'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, Save, X, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AppSumoAdminPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [tierLevel, setTierLevel] = useState(1);
    const [stats, setStats] = useState({ total: 0, redeemed: 0, unused: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/appsumo/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a CSV file first.');
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Reading and uploading codes...');

        const text = await file.text();
        // Super simple CSV split: assumes 1 column (codes) or comma separated rows
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);

        // Extract codes (assuming first item of CSV if separated by comma)
        const codes = lines.map(line => {
            const cols = line.split(',');
            return cols[0].trim(); // take first column as the code
        }).filter(code => code !== 'code' && code !== 'license_key'); // strip standard headers

        if (codes.length === 0) {
            toast.error('No valid codes extracted from file.', { id: toastId });
            setIsUploading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/appsumo/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codes, tierLevel })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Successfully uploaded ${data.inserted} codes to Tier ${tierLevel}!`, { id: toastId, duration: 5000 });
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchStats(); // Update dashboard
            } else {
                toast.error(`Error: ${data.error}`, { id: toastId });
            }
        } catch (error) {
            toast.error('Failed to communicate with server.', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <Toaster position="top-center" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <span className="bg-yellow-500/20 text-yellow-500 p-2 rounded-xl border border-yellow-500/30">
                            <Save className="w-6 h-6" />
                        </span>
                        AppSumo Control Panel
                    </h1>
                    <p className="text-slate-400 mt-2">Manage Lifetime Deal (LTD) codes, upload batches, and monitor redemptions.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="text-slate-400 text-sm font-medium mb-1">Total Codes Uploaded</div>
                    <div className="text-4xl font-black text-white">{stats.total.toLocaleString()}</div>
                    <CheckCircle2 className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                </div>
                <div className="bg-emerald-950 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="text-emerald-400 text-sm font-medium mb-1">Activated (Redeemed)</div>
                    <div className="text-4xl font-black text-emerald-400">{stats.redeemed.toLocaleString()}</div>
                    <RefreshCw className="w-24 h-24 text-emerald-500/10 absolute -right-4 -bottom-4" />
                </div>
                <div className="bg-amber-950 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="text-amber-400 text-sm font-medium mb-1">Pending (Unused)</div>
                    <div className="text-4xl font-black text-amber-400">{stats.unused.toLocaleString()}</div>
                    <Save className="w-24 h-24 text-amber-500/10 absolute -right-4 -bottom-4" />
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">Bulk Key Uploader</h2>
                        <p className="text-slate-400 text-sm">Upload a CSV file provided by AppSumo. Ensure the first column contains the exact License Keys.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">

                    {/* Left: Input Config */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300">Select Tier Level</label>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((tier) => (
                                    <button
                                        key={tier}
                                        onClick={() => setTierLevel(tier)}
                                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${tierLevel === tier ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        Tier {tier}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">Tier 1 = ~5k, Tier 2 = ~15k, Tier 3 = ~50k credits mapping.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300">Select CSV File</label>

                            {!file ? (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-slate-700 hover:border-yellow-500/50 hover:bg-yellow-500/5 bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium mb-1">Click to browse or drag file here</p>
                                        <p className="text-slate-500 text-sm">Supports .CSV files only</p>
                                    </div>
                                </button>
                            ) : (
                                <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                                        <div>
                                            <p className="text-sm font-bold text-white">{file.name}</p>
                                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="text-slate-400 hover:text-red-400 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!file || isUploading
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                }`}
                        >
                            {isUploading ? (
                                <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <><Save className="w-5 h-5" /> Start Injection Process</>
                            )}
                        </button>
                    </div>

                    {/* Right: Info */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-emerald-400" /> Important Guidelines
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                                <span>Export your codes directly from the AppSumo Partner Portal as CSV.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                                <span>The system ignores previously uploaded exact matches, so you can safely upload the updated master sheet.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                                <span>Assign correct tier mappings since they explicitly determine the final credit allocation for redemptions.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                                <span>Do not modify the CSV headers before uploading. The system expects single column standard arrays.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
