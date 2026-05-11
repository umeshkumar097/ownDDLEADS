import { db } from "@/db";
import { agencies, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Landmark, ArrowLeft, Save, Globe, Palette, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AgencyDetailPage({ params }: { params: { id: string } }) {
    const agency = await db.query.agencies.findFirst({
        where: eq(agencies.id, params.id),
    });

    if (!agency) {
        return notFound();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumbs */}
            <Link 
                href="/admin/agencies" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Agencies
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                        <Landmark className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{agency.name}</h1>
                        <p className="text-slate-400 flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4" />
                            {agency.subdomain}.dhandaleads.com
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/5">
                        Deactivate
                    </button>
                    <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-cyan-400" />
                            Branding Settings
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Agency Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={agency.name}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Subdomain</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        defaultValue={agency.subdomain || ''}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                                    />
                                    <span className="text-slate-500 text-sm">.dhandaleads.com</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg border border-white/10"
                                        style={{ backgroundColor: agency.brandColor || '#0f172a' }}
                                    />
                                    <input 
                                        type="text" 
                                        defaultValue={agency.brandColor || '#0f172a'}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Agency Status
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                            <span className="text-emerald-500 font-bold">Active</span>
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Admin Profile */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            Admin Account
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Mail className="w-5 h-5 text-slate-500 mt-1" />
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Email</span>
                                    <span className="text-white font-medium">admin@agency.com</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Calendar className="w-5 h-5 text-slate-500 mt-1" />
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Created On</span>
                                    <span className="text-white font-medium">
                                        {new Date(agency.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats or Usage */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-8">Agency Stats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Total Users</span>
                                <span className="text-3xl font-black text-white">0</span>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Total Credits</span>
                                <span className="text-3xl font-black text-cyan-400">0</span>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Revenue</span>
                                <span className="text-3xl font-black text-emerald-400">₹0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
