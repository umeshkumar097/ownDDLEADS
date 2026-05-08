"use client";

import { useState } from 'react';
import { MoreVertical, ShieldBan, ShieldCheck, Database, Plus, Minus } from 'lucide-react';
import { updateUserCredits, toggleUserBan } from '../actions';
import toast from 'react-hot-toast';

export default function UserActionMenu({
    userId,
    currentCredits,
    isBanned,
    email
}: {
    userId: string,
    currentCredits: number,
    isBanned: boolean,
    email: string
}) {
    const [isOpen, setIsOpen] = useState(false);

    // Modals state
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [adjustmentAmount, setAdjustmentAmount] = useState(100);
    const [creditType, setCreditType] = useState<'credit' | 'debit'>('credit');
    const [creditReason, setCreditReason] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);

    const handleBanToggle = async () => {
        const confirmMsg = isBanned
            ? "Are you sure you want to lift the ban on this user?"
            : "WARNING: Banning this user will instantly lock them out of their account. Proceed?";

        if (!confirm(confirmMsg)) return;

        setIsUpdating(true);
        const toastId = toast.loading("Updating account status...");
        try {
            await toggleUserBan(userId, isBanned, "Manual admin action");
            toast.success("Account status updated successfully", { id: toastId });
            setIsOpen(false);
            window.location.reload();
        } catch (e: any) {
            toast.error(e.message || "Failed to update status", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreditUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!creditReason.trim()) {
            toast.error("Please provide a reason for the audit log.");
            return;
        }

        setIsUpdating(true);
        const toastId = toast.loading(`${creditType === 'credit' ? 'Adding' : 'Deducting'} credits...`);

        try {
            await updateUserCredits(userId, adjustmentAmount, creditType, creditReason);
            toast.success(`${adjustmentAmount} credits ${creditType === 'credit' ? 'added to' : 'deducted from'} account`, { id: toastId });
            setShowCreditModal(false);
            window.location.reload();
        } catch (e: any) {
            toast.error(e.message || "Failed to update credits", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/50">
                        <div className="py-1">
                            <button
                                onClick={() => { setShowCreditModal(true); setIsOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors"
                            >
                                <Database className="w-4 h-4 text-emerald-400" />
                                Manage Wallet
                            </button>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={handleBanToggle}
                                disabled={isUpdating}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${isBanned ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-rose-400 hover:bg-rose-500/10'}`}
                            >
                                {isBanned ? (
                                    <><ShieldCheck className="w-4 h-4" /> Revoke Ban</>
                                ) : (
                                    <><ShieldBan className="w-4 h-4" /> Execute Lockdown</>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Wallet Management Modal */}
            {showCreditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreditModal(false)} />
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 relative w-full max-w-md shadow-2xl text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Database className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Wallet Management</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">Update ledger for <span className="text-indigo-400 font-medium">{email}</span></p>

                        <form onSubmit={handleCreditUpdate} className="space-y-5">
                            {/* Transaction Type Toggle */}
                            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setCreditType('credit')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${creditType === 'credit' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Plus className="w-4 h-4" /> Credit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCreditType('debit')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${creditType === 'debit' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Minus className="w-4 h-4" /> Debit
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount to {creditType === 'credit' ? 'Add' : 'Deduct'}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                        min={1}
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                        {creditType === 'credit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Reason & Notification Context</label>
                                <textarea
                                    value={creditReason}
                                    onChange={(e) => setCreditReason(e.target.value)}
                                    placeholder="e.g. Compensation for platform downtime, Trial pack bonus, etc."
                                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-sm placeholder:text-slate-700"
                                    required
                                />
                                <p className="mt-1 text-[10px] text-slate-500 italic">This reason will be visible to the user in their email notification.</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreditModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 ${creditType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'} text-white`}
                                >
                                    {isUpdating ? 'Updating...' : `Confirm ${creditType === 'credit' ? 'Addition' : 'Deduction'}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
