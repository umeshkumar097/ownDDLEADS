import { db } from "@/db";
import { emailLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Mail, CheckCircle, XCircle, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminEmailLogsPage() {
    // Fetch latest 100 email logs
    const logs = await db.select()
        .from(emailLogs)
        .orderBy(desc(emailLogs.createdAt))
        .limit(100);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Email Delivery Tracker</h1>
                    <p className="text-slate-400 mt-1">Live report of all transactional emails dispatched via Brevo.</p>
                </div>
            </div>

            {/* Live Feed Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Recent Dispatch Logs
                    </h3>
                    <div className="text-xs font-mono text-slate-500 bg-black/40 px-3 py-1 rounded border border-white/5">
                        Showing Last 100 Emails
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Timestamp</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Recipient</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Subject</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Status</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Error Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6 text-xs text-slate-400 font-mono whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-white text-sm">{log.recipientEmail}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-slate-300 max-w-[300px] truncate" title={log.subject}>
                                            {log.subject}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {log.status === 'sent' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle className="w-3.5 h-3.5" /> Sent
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                <XCircle className="w-3.5 h-3.5" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right text-xs text-rose-400 font-mono max-w-[200px] truncate" title={log.errorDetails || ''}>
                                        {log.errorDetails || '—'}
                                    </td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-500">
                                        No emails have been dispatched yet.
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
