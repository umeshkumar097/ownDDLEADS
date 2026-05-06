import { ReactNode } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Target, Activity, Flame, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardStats({ leads }: { leads: any[] }) {
    // Group leads by status for the Funnel/Pie
    const statuses = ['New', 'Contacted', 'Negotiating', 'Closed'];
    const statusCounts = statuses.map(status => ({
        name: status,
        value: leads.filter(l => (l.status || 'New') === status).length
    }));

    const COLORS = ['#818cf8', '#f472b6', '#fbbf24', '#34d399'];

    return (
        <div className="flex flex-col gap-6 h-full">

            {/* Daily Opportunity Radar */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between group"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                            <Target className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold tracking-tight text-white">Opportunity Radar</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/50">AI Curated</span>
                </div>
                
                <div className="space-y-3 flex-1">
                    {leads.slice(0, 3).map((lead, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex justify-between items-center hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group/item">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                                    {lead.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors">{lead.name}</p>
                                    <p className="text-[10px] text-slate-500">{lead.company || 'Private Entity'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full border border-rose-400/20 flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5 fill-rose-400" /> HOT
                                </span>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-4 border-2 border-dashed border-white/5 rounded-2xl">
                            <LayoutGrid className="w-8 h-8 text-slate-700 mb-2" />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Awaiting New Extraction</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Conversion Funnel */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between group"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-purple-400">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold tracking-tight text-white">Sales Pipeline</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400/50">Live Sync</span>
                </div>
                
                <div className="h-32 w-full relative flex items-center justify-center">
                    {leads.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusCounts.filter(s => s.value > 0)}
                                    innerRadius={45}
                                    outerRadius={60}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {statusCounts.filter(s => s.value > 0).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[statuses.indexOf(entry.name)]} className="drop-shadow-[0_0_8px_rgba(129,140,248,0.3)]" />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                             <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500/50 animate-spin-slow"></div>
                             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Waiting for Data</p>
                        </div>
                    )}
                    {leads.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-white">{leads.length}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Leads</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-3 mt-4">
                    {statusCounts.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{s.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
