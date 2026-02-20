import { db } from "@/db";
import { withdrawalRequests, users, referralStats, partnerships } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Landmark, CheckCircle, ShieldAlert, Banknote } from "lucide-react";
import MarkPaidButton from "./MarkPaidButton";

export const dynamic = 'force-dynamic';

export default async function PayoutsPage() {
    // 1. Fetch pending withdrawal requests
    const requests = await db.select({
        id: withdrawalRequests.id,
        amount: withdrawalRequests.amount,
        paymentDetails: withdrawalRequests.paymentDetails,
        requestedAt: withdrawalRequests.requestedAt,
        status: withdrawalRequests.status,
        userEmail: users.email,
        userName: users.name,
        userId: users.id,
        totalEarned: partnerships.totalEarned,
        totalCommissionGenerated: referralStats.totalCommissionGenerated
    })
        .from(withdrawalRequests)
        .leftJoin(users, eq(users.id, withdrawalRequests.userId))
        .leftJoin(partnerships, eq(users.id, partnerships.userId))
        .leftJoin(referralStats, eq(users.id, referralStats.referrerId))
        .where(eq(withdrawalRequests.status, 'pending'))
        .orderBy(desc(withdrawalRequests.requestedAt));

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Landmark className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Treasury & Payouts</h1>
                    <p className="text-slate-400 mt-1">Review partner earnings, verify quality, and mark withdrawals as paid.</p>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Partner Details</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Amount Requested</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Payment Routing Info</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Fraud Check (Sales vs Earned)</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.map((r) => {
                                const earnedStr = r.totalEarned?.toString() || '0';
                                const generatedStr = r.totalCommissionGenerated?.toString() || '0';
                                const isSuspicious = Number(earnedStr) > Number(generatedStr) + 10; // Simple delta check

                                return (
                                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-white">{r.userName || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{r.userEmail}</div>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">{new Date(r.requestedAt).toLocaleDateString()}</div>
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            <div className="font-black text-amber-400 text-xl">
                                                ₹{Number(r.amount).toLocaleString('en-IN')}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300">
                                                <Banknote className="w-3.5 h-3.5 text-slate-500" />
                                                {r.paymentDetails}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-center">
                                            {isSuspicious ? (
                                                <div className="inline-flex flex-col items-center gap-1 group relative">
                                                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                                                    <div className="absolute bottom-full mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        Suspicious Ledger: Earned (₹{earnedStr}) exceeds total generated sales logs.
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20" title="Clear Ledger">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <MarkPaidButton requestId={r.id} />
                                        </td>
                                    </tr>
                                );
                            })}

                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <CheckCircle className="w-12 h-12 text-emerald-500/50 mb-4" />
                                            <p className="text-slate-400 text-lg">Inbox Zero</p>
                                            <p className="text-slate-500 text-sm mt-1">No pending payout requests at the moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
