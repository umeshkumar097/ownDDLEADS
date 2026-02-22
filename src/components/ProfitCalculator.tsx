'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function ProfitCalculator() {
    const [leads, setLeads] = useState(1000);
    const [conversionRate, setConversionRate] = useState(1);
    const [profitPerClient, setProfitPerClient] = useState(5000);

    const estimatedClients = Math.floor(leads * (conversionRate / 100));
    const totalProfit = estimatedClients * profitPerClient;
    const leadsCostEstimate = leads * 0.4; // Assuming rough 40p per lead on higher tiers
    const netROI = totalProfit > 0 ? ((totalProfit - leadsCostEstimate) / leadsCostEstimate) * 100 : 0;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
                    <Calculator className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Interactive Profit Calculator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                {/* Sliders */}
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-medium text-slate-300">How many leads will you reach?</label>
                            <span className="font-mono text-indigo-400 font-bold">{leads.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="10000"
                            step="100"
                            value={leads}
                            onChange={(e) => setLeads(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-medium text-slate-300">Estimated Conversion Rate</label>
                            <span className="font-mono text-emerald-400 font-bold">{conversionRate.toFixed(1)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={conversionRate}
                            onChange={(e) => setConversionRate(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Industry average is 0.5% - 2% for cold outreach.</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-medium text-slate-300">Net Profit per Client (₹)</label>
                            <span className="font-mono text-amber-400 font-bold">₹{profitPerClient.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="50000"
                            step="1000"
                            value={profitPerClient}
                            onChange={(e) => setProfitPerClient(Number(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <div className="text-center space-y-2 mb-6 border-b border-white/10 pb-6">
                        <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Projected Sales</p>
                        <div className="text-5xl font-black text-white flex items-center justify-center gap-1">
                            {estimatedClients} <span className="text-lg text-slate-500 font-medium">Clients</span>
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" /> Estimated Revenue
                        </p>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            ₹{totalProfit.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Est. Lead Cost:</span>
                            <span className="text-slate-300 font-mono">~₹{leadsCostEstimate.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-400">Potential ROAS:</span>
                            <span className="text-emerald-400 font-bold font-mono">
                                {isFinite(netROI) && netROI > 0 ? `+${Math.floor(netROI)}%` : '0%'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partnership Pitch */}
            <div className="mt-8 bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 md:flex items-center justify-between">
                <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-indigo-400" />
                        Make Your Software Free
                    </h4>
                    <p className="text-slate-300 text-sm max-w-xl mt-1">
                        Join our Partnership Program. Refer friends and earn up to 20% recurring commission on their purchases. Easily cover your own lead costs!
                    </p>
                </div>
                <Link href="/partnership" className="mt-4 md:mt-0 inline-block shrink-0 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm">
                    View Partnership Tiers
                </Link>
            </div>
        </div>
    );
}
