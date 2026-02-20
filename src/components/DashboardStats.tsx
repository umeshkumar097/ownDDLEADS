import { ReactNode } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, TrendingUp, Target } from 'lucide-react';

export default function DashboardStats({ leads }: { leads: any[] }) {
    // Calculate Total Pipeline Value
    const totalPipelineValue = leads.reduce((sum, current) => {
        return sum + (current.leadValue || 0);
    }, 0);

    // Group leads by status for the Funnel/Pie
    const statuses = ['New', 'Contacted', 'Negotiating', 'Closed'];
    const statusCounts = statuses.map(status => ({
        name: status,
        value: leads.filter(l => (l.status || 'New') === status).length
    }));

    const COLORS = ['#818cf8', '#f472b6', '#fbbf24', '#34d399'];

    // Convert value to INR string format
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val * 83); // Simple USD to INR mock conversion for the "Sales Command Center"
    };

    return (
        <div className="flex flex-col gap-6 mb-4">

            {/* Daily Opportunity Radar */}
            <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 text-purple-400 mb-2">
                        <Target className="w-5 h-5" />
                        <h3 className="font-semibold tracking-wide">Opportunity Radar</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">High-Value AI Curated Targets</p>
                </div>
                <div className="space-y-3">
                    {leads.slice(0, 2).map((lead, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition">
                            <div>
                                <p className="text-sm font-bold text-white group-hover:text-purple-300 transition">{lead.name}</p>
                                <p className="text-xs text-slate-400">{lead.role}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">HOT</span>
                        </div>
                    ))}
                    {leads.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No leads extracted today.</p>}
                </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 text-slate-300 mb-2">
                        <h3 className="font-semibold tracking-wide">Conversion Funnel</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">Lead Status Distribution</p>
                </div>
                <div className="h-40 w-full relative">
                    {leads.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusCounts.filter(s => s.value > 0)}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusCounts.filter(s => s.value > 0).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[statuses.indexOf(entry.name)]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            Awaiting Data
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
