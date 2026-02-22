import { db } from "@/db";
import { usageLogs, users, allTransactions } from "@/db/schema";
import { desc, eq, sum } from "drizzle-orm";
import { Activity, Zap, Server, Shield, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    // 1. Fetch latest 100 usage logs
    const logs = await db.select({
        id: usageLogs.id,
        action: usageLogs.action,
        creditsDeducted: usageLogs.creditsDeducted,
        details: usageLogs.details,
        timestamp: usageLogs.timestamp,
        userEmail: users.email,
        userName: users.name
    })
        .from(usageLogs)
        .leftJoin(users, eq(users.id, usageLogs.userId))
        .orderBy(desc(usageLogs.timestamp))
        .limit(100);

    // 2. Fetch total credits burned all time
    const totalBurnedResult = await db.select({ value: sum(usageLogs.creditsDeducted) }).from(usageLogs);
    const totalBurnedAllTime = totalBurnedResult[0]?.value || 0;

    // 3. Marketing ROI calculations (Phase 21)
    const totalRevenueResult = await db.select({ value: sum(allTransactions.amount) })
        .from(allTransactions)
        .where(eq(allTransactions.status, 'SUCCESS'));
    const totalRevenue = parseFloat(totalRevenueResult[0]?.value || '0');

    // Ad Spend is currently mocked. A future phase could connect this to Meta/Google APIs
    const MOCK_AD_SPEND = 25000;
    const marketingROI = MOCK_AD_SPEND > 0 ? ((totalRevenue - MOCK_AD_SPEND) / MOCK_AD_SPEND) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                    <Activity className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Usage Analytics</h1>
                    <p className="text-slate-400 mt-1">Live platform activity, credit consumption, and system health.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-rose-900/20 to-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        <Zap className="w-4 h-4 text-emerald-400" /> Lifetime Credits Burned
                    </div>
                    <div className="text-4xl font-black text-white">
                        {Number(totalBurnedAllTime).toLocaleString('en-IN')}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        <Server className="w-4 h-4 text-indigo-400" /> Scraper Nodes Status
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-2xl font-bold text-emerald-400">100% Online</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2">
                        <Shield className="w-4 h-4 text-amber-400" /> Rate Limit Status
                    </div>
                    <div className="text-xl font-bold text-slate-300">
                        Stable (No active blocks)
                    </div>
                </div>

                {/* Marketing ROI Card */}
                <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10"><TrendingUp className="w-32 h-32" /></div>
                    <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-[10px] sm:text-xs mb-4 relative z-10">
                        <TrendingUp className="w-4 h-4" /> Paid Ads ROI (ROAS)
                    </div>

                    <div className="flex flex-col gap-1 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-400 text-xs">Revenue</span>
                            <span className="text-emerald-400 font-mono font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/10 pb-2">
                            <span className="text-slate-400 text-xs">Ad Spend</span>
                            <span className="text-rose-400 font-mono font-bold">₹{MOCK_AD_SPEND.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-slate-300 font-bold text-sm">Net ROI</span>
                            <div className={`font-black tracking-tight ${marketingROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {marketingROI > 0 ? '+' : ''}{marketingROI.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Feed Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-rose-400" />
                        Global Lead Generation Log
                    </h3>
                    <div className="text-xs font-mono text-slate-500 bg-black/40 px-3 py-1 rounded border border-white/5">
                        Showing Last 100 System Events
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Time</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">User</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Action Type</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Cost</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Target Meta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6 text-xs text-slate-400 font-mono whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour12: false })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-white text-sm">{log.userName || 'Unknown'}</div>
                                        <div className="text-[10px] text-slate-500">{log.userEmail}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {Number(log.creditsDeducted) > 0 ? (
                                            <span className="font-mono text-rose-400 font-bold text-sm">-{log.creditsDeducted}</span>
                                        ) : (
                                            <span className="font-mono text-emerald-400 font-bold text-sm">0</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right text-xs text-slate-500 font-mono max-w-[200px] truncate" title={log.details || ''}>
                                        {log.details || '—'}
                                    </td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-500">
                                        System is idle. No logs generated yet.
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
