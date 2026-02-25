import { db } from "@/db";
import { adsLeads } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Building2, Mail, Phone, ExternalLink, CalendarDays, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminAdsLeadsPage() {
    const leads = await db.query.adsLeads.findMany({
        orderBy: [desc(adsLeads.createdAt)]
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Ads Leads Hub</h1>
                    <p className="text-slate-400 mt-1">Direct inquiries captured via paid ad funnels and the /get-leads-fast exit intent loop.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total High-Intent Leads</p>
                    <p className="text-4xl font-black text-cyan-400">{leads.length}</p>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-bold">
                                <th className="p-4 whitespace-nowrap">Timestamp</th>
                                <th className="p-4">Contact Person</th>
                                <th className="p-4">WhatsApp / Phone</th>
                                <th className="p-4">Organization</th>
                                <th className="p-4">Source Attributes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                        No leads have been generated yet. Ensure your ads are routing to /get-leads-fast limits.
                                    </td>
                                </tr>
                            ) : leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <CalendarDays className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium">{new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <p className="text-white font-bold text-sm">{lead.name}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                            <Mail className="w-3 h-3" /> {lead.email}
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <a href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                            <Phone className="w-4 h-4" /> {lead.phone}
                                            <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                        </a>
                                    </td>

                                    <td className="p-4">
                                        {lead.companyName ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                    <Building2 className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <span className="text-sm text-slate-300 font-medium">{lead.companyName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500 italic">Pre-revenue / Individual</span>
                                        )}
                                    </td>

                                    <td className="p-4 space-y-2">
                                        {lead.sourceCity && (
                                            <div className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded inline-flex items-center gap-2 mr-2">
                                                <span className="opacity-50 uppercase tracking-widest text-[10px]">GEO:</span> <span className="font-bold">{lead.sourceCity}</span>
                                            </div>
                                        )}
                                        {lead.sourceKeyword && (
                                            <div className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded inline-flex items-center gap-2">
                                                <span className="opacity-50 uppercase tracking-widest text-[10px]">INTENT:</span> <span className="font-bold capitalize">{lead.sourceKeyword}</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
