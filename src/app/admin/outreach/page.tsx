'use client';

import { useState, useEffect } from "react";
import { Users, Phone, Mail, Calendar, ExternalLink, AlertCircle, Send } from "lucide-react";
import BulkEmailDialog from "./BulkEmailDialog";

export default function OutreachPage() {
    const [outreachLeads, setOutreachLeads] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkEmail, setShowBulkEmail] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/admin/outreach-leads');
            const data = await res.json();
            setOutreachLeads(data.leads || []);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === outreachLeads.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(outreachLeads.map(l => l.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading Outreach Data...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {showBulkEmail && (
                <BulkEmailDialog 
                    selectedUserIds={selectedIds} 
                    onClose={() => setShowBulkEmail(false)} 
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-500/20 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                        <Users className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">Outreach Leads</h1>
                        <p className="text-slate-400 mt-1">Users who signed up but haven't purchased anything yet.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={() => setShowBulkEmail(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            <Send className="w-4 h-4" /> Send Bulk Email ({selectedIds.length})
                        </button>
                    )}
                    <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-300 text-sm font-bold">{outreachLeads.length} Hot Leads</span>
                    </div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                                <th className="py-4 px-6 w-12">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === outreachLeads.length && outreachLeads.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">User Identity</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Contact Details</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Registered On</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-right">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {outreachLeads.map((lead) => (
                                <tr key={lead.id} className={`hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(lead.id) ? 'bg-indigo-500/5' : ''}`}>
                                    <td className="py-5 px-6">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(lead.id)}
                                            onChange={() => toggleSelect(lead.id)}
                                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold border border-orange-500/20 uppercase">
                                                {(lead.name?.[0] || lead.email?.[0] || '?')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover:text-orange-300 transition-colors">
                                                    {lead.name || 'Anonymous'}
                                                </div>
                                                <div className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {lead.id.substring(0, 12)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <a href={`mailto:${lead.email}`} className="text-sm text-slate-300 flex items-center gap-2 hover:text-indigo-400 transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                                {lead.email}
                                            </a>
                                            {lead.phone && (
                                                <a href={`tel:${lead.phone}`} className="text-sm text-emerald-400 flex items-center gap-2 hover:underline">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {lead.phone}
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="text-sm text-slate-400 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN') : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <a 
                                            href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`} 
                                            target="_blank" 
                                            className="inline-flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all"
                                        >
                                            WhatsApp <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            {outreachLeads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <p className="text-slate-500 italic">No outreach leads found. Everyone is buying! 🎉</p>
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
