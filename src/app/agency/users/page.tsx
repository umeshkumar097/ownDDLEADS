import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, creditsBalance } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Users, UserPlus, Shield, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyUsersPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'agency_admin' && session.user.role !== 'admin')) {
        redirect('/login');
    }

    const agencyId = session.user.agencyId;
    if (!agencyId) {
        return <div>Unauthorized: No agency associated.</div>;
    }

    const agencyUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        credits: creditsBalance.totalCredits,
        creditsUsed: creditsBalance.creditsUsed,
    })
    .from(users)
    .leftJoin(creditsBalance, eq(users.id, creditsBalance.userId))
    .where(eq(users.agencyId, agencyId))
    .orderBy(desc(users.id));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Sub-User Directory</h1>
                        <p className="text-slate-500">Manage your agency's team and credit limits.</p>
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">
                    <UserPlus className="w-5 h-5" />
                    Add New User
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User Identity</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Level</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Credits (Used/Total)</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {agencyUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shrink-0">
                                                {(u.name?.[0] || u.email?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{u.name || 'Unnamed User'}</div>
                                                <div className="text-xs text-slate-400">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Shield className={`w-4 h-4 ${u.role === 'agency_admin' ? 'text-amber-500' : 'text-slate-400'}`} />
                                            <span className="capitalize">{u.role.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <div className="text-sm font-mono font-bold">
                                                <span className="text-rose-500">{u.creditsUsed || '0.00'}</span>
                                                <span className="text-slate-300 mx-1">/</span>
                                                <span className="text-emerald-600">{u.credits || '0.00'}</span>
                                            </div>
                                            <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-500" 
                                                    style={{ width: `${Math.min(100, (Number(u.creditsUsed || 0) / Math.max(1, Number(u.credits || 0))) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                                            Allocate Credits
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {agencyUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                        No sub-users found. Add your first user to get started.
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
