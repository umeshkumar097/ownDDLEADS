import { db } from "@/db";
import { allTransactions, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Wallet, Activity, TrendingUp, DollarSign } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
    // 1. Fetch latest 100 transactions
    const txns = await db.select({
        id: allTransactions.id,
        amount: allTransactions.amount,
        creditsAdded: allTransactions.creditsAdded,
        gatewayTxnId: allTransactions.gatewayTxnId,
        status: allTransactions.status,
        createdAt: allTransactions.createdAt,
        userEmail: users.email,
        userName: users.name
    })
        .from(allTransactions)
        .leftJoin(users, eq(users.id, allTransactions.userId))
        .orderBy(desc(allTransactions.createdAt))
        .limit(100);

    // Calculate total revenue from successful txns
    const totalRevenue = txns
        .filter(t => t.status === 'SUCCESS')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Wallet className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Live Sales Ledger</h1>
                    <p className="text-slate-400 mt-1">Real-time payment tracking and revenue metrics.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Recent Gross Revenue
                    </div>
                    <div className="text-5xl font-black text-emerald-400">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        <Activity className="w-4 h-4 text-indigo-400" /> Total Ledger Entries
                    </div>
                    <div className="text-5xl font-black text-white">
                        {txns.length}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
                    <div className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Live Feed
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Date & Time</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">User Identity</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Amount Paid</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Gateway Txn ID</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {txns.map((t) => (
                                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6 text-sm text-slate-400">
                                        {t.createdAt.toLocaleString('en-IN', {
                                            month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-white">{t.userName || 'System Client'}</div>
                                        <div className="text-xs text-slate-500">{t.userEmail}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="font-black text-emerald-400 text-lg flex items-center justify-center gap-1">
                                            ₹{Number(t.amount).toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-0.5">
                                            +{t.creditsAdded} Credits
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="font-mono text-xs text-slate-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                                            {t.gatewayTxnId || 'OFFLINE_TXN'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        {t.status === 'SUCCESS' ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                SUCCESS
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                {t.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {txns.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-500">
                                        No transactions recorded yet. Data will flow here automatically upon checkout.
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
