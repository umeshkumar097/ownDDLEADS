import { db } from "@/db";
import { users, creditsBalance, partnerships } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Users, Search, ShieldAlert, Award, AlertTriangle } from "lucide-react";
import UserActionMenu from "./UserActionMenu";

// Force dynamic rendering since this requires real-time DB queries
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q || "";

    // Building the global users directory query
    let baseQuery = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isBanned: users.isBanned,
        createdAt: users.emailVerified, // Approximating join date based on email validation or last auth event
        credits: creditsBalance.totalCredits,
        creditsUsed: creditsBalance.creditsUsed,
        isPartner: partnerships.isEligible
    })
        .from(users)
        .leftJoin(creditsBalance, eq(users.id, creditsBalance.userId))
        .leftJoin(partnerships, eq(users.id, partnerships.userId));

    if (query) {
        baseQuery = baseQuery.where(
            sql`${users.email} ILIKE ${`%${query}%`} OR ${users.name} ILIKE ${`%${query}%`} OR ${users.phone} ILIKE ${`%${query}%`}`
        ) as any;
    }

    const allUsers = await baseQuery.orderBy(desc(users.id)).limit(100);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">User Directory</h1>
                        <p className="text-slate-400 mt-1">Manage all accounts, modify credits, or apply restrictions.</p>
                    </div>
                </div>

                {/* Secure Search Bar */}
                <form className="relative w-full md:w-96">
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search by Email, Name or Phone..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button type="submit" className="hidden" />
                </form>
            </div>

            {/* Main Data Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Identity</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Contact</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Badges</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Ledger (Used / Total)</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {allUsers.map((u) => (
                                <tr key={u.id} className={`hover:bg-white/[0.02] transition-colors ${u.isBanned ? 'bg-rose-500/5' : ''}`}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30 shrink-0">
                                                {(u.name?.[0] || u.email?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white flex items-center gap-2">
                                                    {u.name || 'Unnamed User'}
                                                    {u.isBanned && <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Banned</span>}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5" title={u.id}>
                                                    ID: {u.id.substring(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-slate-300">{u.email}</div>
                                        <div className="text-xs text-slate-500 mt-1">{u.phone || 'No Phone'}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {u.role === 'admin' && (
                                                <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30" title="System Admin">
                                                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                                                </span>
                                            )}
                                            {u.isPartner && (
                                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30" title="Verified Partner">
                                                    <Award className="w-4 h-4 text-emerald-500" />
                                                </span>
                                            )}
                                            {!u.isPartner && u.role !== 'admin' && (
                                                <span className="text-slate-600 text-xs">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex flex-col items-center justify-center">
                                            <div className="font-mono text-lg font-bold text-white">
                                                <span className="text-rose-400">{u.creditsUsed || 0}</span>
                                                <span className="text-slate-600 mx-1">/</span>
                                                <span className="text-emerald-400">{u.credits || 10}</span>
                                            </div>

                                            {/* Progress Bar Visualizer */}
                                            {u.credits !== null && u.creditsUsed !== null && Number(u.credits) > 0 && (
                                                <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${Math.min(100, (Number(u.creditsUsed) / Number(u.credits)) * 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <UserActionMenu
                                            userId={u.id}
                                            currentCredits={u.credits || 10}
                                            isBanned={u.isBanned || false}
                                            email={u.email}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {allUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <AlertTriangle className="w-12 h-12 text-slate-600 mb-4" />
                                            <p className="text-slate-400 text-lg">No users found.</p>
                                            <p className="text-slate-500 text-sm mt-1">Try adjusting your search query.</p>
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
