'use client';

import { useState } from 'react';
import { MoreVertical, ShieldBan, ShieldCheck, Database, FileText } from 'lucide-react';
import { overrideCredits, toggleUserBan } from '../actions';
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
    const [newCredits, setNewCredits] = useState(currentCredits);
    const [creditReason, setCreditReason] = useState('Manual override requested by customer support.');

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
        setIsUpdating(true);
        const toastId = toast.loading("Overriding credits...");

        try {
            await overrideCredits(userId, newCredits, creditReason);
            toast.success(`Credits updated to ${newCredits}`, { id: toastId });
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
                                Edit Credits
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

            {/* Credit Override Modal */}
            {showCreditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreditModal(false)} />
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 relative w-full max-w-md shadow-2xl text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Manual Credit Override</h3>
                        <p className="text-sm text-slate-400 mb-6">Modifying the ledger for <span className="text-indigo-400 font-medium">{email}</span></p>

                        <form onSubmit={handleCreditUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">New Total Credits Amount</label>
                                <input
                                    type="number"
                                    value={newCredits}
                                    onChange={(e) => setNewCredits(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    min={0}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Audit Reason (Required)</label>
                                <textarea
                                    value={creditReason}
                                    onChange={(e) => setCreditReason(e.target.value)}
                                    className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-sm"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowCreditModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-bold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Apply Override'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
