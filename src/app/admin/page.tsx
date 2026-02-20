import { getAdminStats } from "./actions";
import { Activity, Database, Users, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    let stats;
    try {
        stats = await getAdminStats();
    } catch (e: any) {
        // Fallback or unauthorized bounce
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 font-sans selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                    <Database className="w-10 h-10 text-indigo-500" />
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">System Control Panel</h1>
                        <p className="text-slate-400 mt-1">Superuser monitoring and global usage logs.</p>
                    </div>
                </div>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex items-center justify-between shadow-[0_0_40px_-15px_rgba(79,70,229,0.2)]">
                        <div>
                            <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-1">Total Leads Extracted</p>
                            <h2 className="text-5xl font-black text-indigo-400">{stats.totalLeadsGenerated}</h2>
                        </div>
                        <Users className="w-16 h-16 text-indigo-500/20" />
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex items-center justify-between shadow-[0_0_40px_-15px_rgba(79,70,229,0.2)]">
                        <div>
                            <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-1">Total Credits Purchased</p>
                            <h2 className="text-5xl font-black text-emerald-400">{stats.totalCreditsPurchased}</h2>
                        </div>
                        <Database className="w-16 h-16 text-emerald-500/20" />
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex items-center justify-between shadow-[0_0_40px_-15px_rgba(79,70,229,0.2)]">
                        <div>
                            <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-1">Total Credits Burned</p>
                            <h2 className="text-5xl font-black text-purple-400">{stats.totalCreditsBurned}</h2>
                        </div>
                        <Activity className="w-16 h-16 text-purple-500/20" />
                    </div>
                </div>

                {/* Live Audit Log Section */}
                <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold">Recent App Activity (Global)</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="py-4 px-6 text-sm font-medium text-slate-400">User Email</th>
                                    <th className="py-4 px-6 text-sm font-medium text-slate-400">Action Occurred</th>
                                    <th className="py-4 px-6 text-sm font-medium text-slate-400 text-center">Cost (Credits)</th>
                                    <th className="py-4 px-6 text-sm font-medium text-slate-400 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.recentLogs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-white">{log.userEmail || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-500">[{log.userRole?.toUpperCase()}] • {log.userName}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-mono text-slate-300">
                                            {log.creditsDeducted > 0 ? (
                                                <span className="text-rose-400">-{log.creditsDeducted}</span>
                                            ) : (
                                                <span className="text-emerald-400">0</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm text-slate-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-500">No activity logged yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
