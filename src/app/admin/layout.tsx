import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    Users,
    Wallet,
    Landmark,
    Activity,
    Mail,
    Megaphone,
    LogOut
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Strict Guard
    if (!session || !session.user) {
        // Use a hard redirect or add a cache-buster query
        redirect(`/godeye?error=SessionExpired&t=${Date.now()}`);
    }

    const [liveServerUser] = await db.select().from(users).where(eq(users.id, session.user.id as string)).limit(1);

    if (liveServerUser?.email === 'info@aiclex.in' && liveServerUser.role !== 'admin') {
        // Auto-Promote the exact system admin email requested by User
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, liveServerUser.id));
        liveServerUser.role = 'admin'; // Override local reference
    }

    if (!liveServerUser || liveServerUser.role !== 'admin') {
        // Send them explicitly back to their regular dashboard if not authorized
        redirect(`/dashboard?error=UnauthorizedAdmin&t=${Date.now()}`);
    }

    if (!liveServerUser.emailVerified) {
        redirect('/verify-email');
    }

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">
            {/* Sidebar (Dark Emerald Theme) */}
            <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col fixed inset-y-0 shadow-2xl z-10">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <Image src="/logo.png" width={160} height={40} alt="DhandaLeads Admin" className="h-8 object-contain filter invert opacity-90" />
                    </div>
                    <p className="text-xs font-mono text-emerald-500 font-bold uppercase tracking-widest bg-emerald-950/50 inline-block px-2 py-0.5 rounded border border-emerald-500/20">Control Tower</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group relative overflow-hidden text-sm font-medium">
                        <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                        <span>Overview</span>
                    </Link>

                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Users className="w-5 h-5 text-slate-400 group-hover:text-amber-400" />
                        <span>User Directory</span>
                    </Link>

                    <Link href="/admin/agencies" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Landmark className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                        <span>Agencies (Whitelabel)</span>
                    </Link>

                    <Link href="/admin/outreach" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 transition-colors group text-sm font-medium">
                        <Users className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-300">Outreach Leads</span>
                        <span className="ml-auto bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">New</span>
                    </Link>

                    <Link href="/admin/transactions" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Wallet className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                        <span>Ledger & Sales</span>
                    </Link>

                    <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Landmark className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                        <span>Treasury (Payouts)</span>
                    </Link>

                    <Link href="/admin/pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium tracking-wide border border-transparent hover:border-fuchsia-500/20 hover:bg-fuchsia-500/5">
                        <Wallet className="w-5 h-5 text-slate-400 group-hover:text-fuchsia-400" />
                        <span className="group-hover:text-fuchsia-300 transition-colors text-slate-300 text-sm">Packages & Pricing</span>
                    </Link>

                    <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Activity className="w-5 h-5 text-slate-400 group-hover:text-rose-400" />
                        <span>Usage Analytics</span>
                    </Link>

                    <Link href="/admin/emails" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium">
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                        <span>Email Logs</span>
                    </Link>

                    <Link href="/admin/seo" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5">
                        <Megaphone className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                        <span className="group-hover:text-emerald-300 transition-colors text-slate-300 text-sm">SEO Engine</span>
                    </Link>

                    <Link href="/admin/ads-leads" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium border border-transparent hover:border-cyan-500/20 hover:bg-cyan-500/5 mt-1">
                        <Users className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                        <span className="group-hover:text-cyan-300 transition-colors text-slate-300 text-sm">Ads Leads Hub</span>
                    </Link>

                    <Link href="/admin/appsumo" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-sm font-medium border border-transparent hover:border-yellow-500/20 hover:bg-yellow-500/5 mt-1">
                        <Landmark className="w-5 h-5 text-slate-400 group-hover:text-yellow-400" />
                        <span className="group-hover:text-yellow-300 transition-colors text-slate-300 text-sm">AppSumo Manager</span>
                    </Link>

                    <div className="pt-6 pb-2">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Super Actions</p>
                    </div>

                    <Link href="/admin/broadcast" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors border border-indigo-500/20 relative group text-sm font-bold">
                        <Megaphone className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <span>Global Broadcast</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 transition-colors text-sm font-medium">
                        <LogOut className="w-5 h-5" />
                        <span>Exit Tower</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 ml-64 bg-slate-950 p-8 min-h-screen relative overflow-x-hidden">
                {/* Emerald Glow Override for Admin Feel */}
                <div className="absolute top-0 left-0 w-full h-96 bg-emerald-600/5 blur-[150px] pointer-events-none -z-10" />
                {children}
            </main>
        </div>
    );
}
