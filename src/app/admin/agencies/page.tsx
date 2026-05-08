import { db } from "@/db";
import { agencies, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Landmark, Plus, Globe, Palette, ShieldCheck } from "lucide-react";
import Link from "next/link";

import CreateAgencyButton from "./CreateAgencyButton";

export const dynamic = 'force-dynamic';

export default async function AdminAgenciesPage() {
    const allAgencies = await db.select({
        id: agencies.id,
        name: agencies.name,
        subdomain: agencies.subdomain,
        status: agencies.status,
        createdAt: agencies.createdAt,
        adminId: agencies.adminId,
    }).from(agencies).orderBy(desc(agencies.createdAt));

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                        <Landmark className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">Agency Manager</h1>
                        <p className="text-slate-400 mt-1">Configure and monitor whitelabel partners.</p>
                    </div>
                </div>

                <CreateAgencyButton />
            </div>

            {/* Agencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allAgencies.map((agency) => (
                    <div key={agency.id} className="bg-slate-900 border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all group shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/20 transition-colors">
                                <Landmark className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                            </div>
                            <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md ${agency.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
                                {agency.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{agency.name}</h3>
                        <p className="text-slate-500 text-sm mb-6 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            {agency.subdomain}.dhandaleads.com
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Branding</span>
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs text-white font-medium">Custom UI</span>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Access</span>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs text-white font-medium">Whitelabel</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                            <Link 
                                href={`/admin/agencies/${agency.id}`}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-2.5 rounded-xl text-sm font-bold transition-colors border border-white/5"
                            >
                                Manage
                            </Link>
                            <button className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-2.5 rounded-xl text-sm font-bold transition-colors border border-cyan-500/20">
                                Credits
                            </button>
                        </div>
                    </div>
                ))}

                {allAgencies.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-3xl">
                        <Landmark className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No Agencies Found</h3>
                        <p className="text-slate-500 mt-2">Start by creating your first whitelabel partner.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
