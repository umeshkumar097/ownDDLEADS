'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Copy, Landmark, ArrowUpRight, CheckCircle2, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

export default function PartnershipPage() {
    const { status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
        else if (status === 'authenticated') fetchData();
    }, [status, router]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/partnership');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error('Failed to load partnership data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!data?.referralCode) return;
        const link = `${window.location.origin}/?ref=${data.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!withdrawAmount || !upiId) return toast.error("Please enter amount and UPI ID.");
        if (Number(withdrawAmount) > Number(data?.withdrawableBalance)) {
            return toast.error("Amount exceeds withdrawable balance.");
        }

        setIsWithdrawing(true);
        const toastId = toast.loading("Processing withdrawal request...");
        try {
            const res = await fetch('/api/partnership/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(withdrawAmount), paymentDetails: upiId })
            });
            const json = await res.json();
            if (res.ok) {
                toast.success(json.message, { id: toastId });
                setWithdrawAmount('');
                setUpiId('');
                fetchData(); // Refresh balances
            } else {
                toast.error(json.error || "Withdrawal failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to request withdrawal", { id: toastId });
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-emerald-400 font-medium">Loading Earnings Vault...</p>
            </div>
        );
    }

    if (!data?.isEligible) {
        return (
            <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-10 ml-0 md:ml-64 flex flex-col items-center justify-center selection:bg-emerald-500/30">
                <div className="max-w-md text-center bg-black/40 border border-white/5 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mt-16"></div>
                    <Lock className="w-16 h-16 text-emerald-400 mx-auto mb-6 relative z-10" />
                    <h1 className="text-2xl font-bold mb-4 relative z-10">Partnership Locked</h1>
                    <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
                        To maintain a high-quality network, our <span className="text-white font-semibold">Earn & Scale</span> program is exclusive to verified customers. Complete a minimum purchase of ₹499 to unlock your referral link and start earning real cash.
                    </p>
                    <Link href="/pricing" className="inline-flex items-center justify-center w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 relative z-10">
                        Top-up Wallet to Unlock <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-10 ml-0 md:ml-64 selection:bg-emerald-500/30">
            <Toaster position="bottom-right" />

            <div className="max-w-6xl mx-auto space-y-8 mt-16 md:mt-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-500/20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <ShieldCheck className="w-4 h-4" /> Verified Partner
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                            <Landmark className="w-8 h-8 text-emerald-400" /> Earnings Vault
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your referrals, track commissions, and withdraw real cash directly to your bank.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Balances & Link */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
                                <h3 className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-2">Total Earned</h3>
                                <div className="text-4xl font-black text-white flex items-center gap-2">
                                    <IndianRupee className="w-8 h-8 text-emerald-500" />
                                    {data.totalEarned}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h3 className="text-emerald-200 text-sm font-semibold tracking-widest uppercase mb-2 relative z-10">Withdrawable Balance</h3>
                                <div className="text-5xl font-black text-white flex items-center gap-2 relative z-10">
                                    <IndianRupee className="w-10 h-10 text-emerald-400" />
                                    {data.withdrawableBalance}
                                </div>
                            </div>
                        </div>

                        {/* Referral Link Box */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 md:p-8">
                            <h3 className="font-bold text-lg mb-2">Your Unique Referral Link</h3>
                            <p className="text-sm text-slate-400 mb-6">Share this link to earn 20% on their 1st purchase, 5% on their 2nd, and 1% for life.</p>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-emerald-400 text-sm overflow-x-auto whitespace-nowrap">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/?ref=${data.referralCode}` : `...?ref=${data.referralCode}`}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-colors shrink-0"
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Form */}
                    <div className="col-span-1 bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                        <h3 className="font-bold text-xl mb-6">Request Withdrawal</h3>
                        <form onSubmit={handleWithdraw} className="space-y-5 flex-1 flex flex-col">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Amount to Withdraw (₹)</label>
                                <input
                                    type="number"
                                    min="100"
                                    max={data.withdrawableBalance}
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-colors"
                                    placeholder="e.g. 500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">UPI ID or Bank Details</label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-colors"
                                    placeholder="yourname@upi"
                                    required
                                />
                            </div>

                            <div className="mt-auto pt-6">
                                <button
                                    type="submit"
                                    disabled={isWithdrawing || Number(data.withdrawableBalance) < 100}
                                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isWithdrawing ? 'Processing...' : 'Withdraw Funds'} <ArrowUpRight className="w-5 h-5" />
                                </button>
                                {Number(data.withdrawableBalance) < 100 && (
                                    <p className="text-center text-xs text-rose-400 mt-3">Minimum withdrawal is ₹100.</p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Referrals Activity Table */}
                <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden mt-8">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold">Your Referrals Activity</h2>
                    </div>

                    {data.referrals?.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p>No referrals yet. Share your link to start earning!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02]">
                                        <th className="py-4 px-6 text-sm font-medium text-slate-400">Referred User</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-400 text-center">Purchases Made</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-400 text-right">Commission Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.referrals.map((ref: any, i: number) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-white">{ref.referredName || 'Anonymous'}</div>
                                                <div className="text-xs text-slate-500">{ref.referredEmail}</div>
                                            </td>
                                            <td className="py-4 px-6 text-center text-slate-300">
                                                <span className="bg-white/5 px-3 py-1 rounded-full text-sm">{ref.purchaseCount}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-mono font-bold text-emerald-400">
                                                +₹{ref.commission}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
