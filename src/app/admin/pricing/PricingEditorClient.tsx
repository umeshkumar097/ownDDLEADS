'use client';

import { useState } from 'react';
import { updatePricingPlan } from '../actions';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Plus, X } from 'lucide-react';

export default function PricingEditorClient({ initialPlans }: { initialPlans: any[] }) {
    const [plans, setPlans] = useState<any[]>(initialPlans);
    const [savingId, setSavingId] = useState<number | null>(null);

    const handleUpdateField = (planId: number, field: string, value: any) => {
        setPlans(prev => prev.map(p => p.id === planId ? { ...p, [field]: value } : p));
    };

    const handleUpdateFeature = (planId: number, featureIndex: number, newValue: string) => {
        setPlans(prev => prev.map(p => {
            if (p.id === planId) {
                const newFeatures = [...p.features];
                newFeatures[featureIndex] = newValue;
                return { ...p, features: newFeatures };
            }
            return p;
        }));
    };

    const handleAddFeature = (planId: number) => {
        setPlans(prev => prev.map(p => {
            if (p.id === planId) {
                return { ...p, features: [...p.features, "New Feature"] };
            }
            return p;
        }));
    };

    const handleRemoveFeature = (planId: number, featureIndex: number) => {
        setPlans(prev => prev.map(p => {
            if (p.id === planId) {
                const newFeatures = [...p.features];
                newFeatures.splice(featureIndex, 1);
                return { ...p, features: newFeatures };
            }
            return p;
        }));
    };

    const handleSave = async (plan: any) => {
        setSavingId(plan.id);
        const toastId = toast.loading(`Saving ${plan.planName}...`);

        try {
            const res = await updatePricingPlan(plan.id, {
                planName: plan.planName,
                priceInINR: parseInt(plan.priceInINR.toString()),
                creditsAwarded: parseInt(plan.creditsAwarded.toString()),
                isPopular: plan.isPopular,
                features: plan.features
            });

            if (res.success) {
                toast.success('Pricing Plan Updated!', { id: toastId });
            } else {
                throw new Error("Action failed");
            }
        } catch (e) {
            toast.error('Failed to update config.', { id: toastId });
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

            {plans.map(plan => (
                <div key={plan.id} className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-full">
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-wider">Plan Name</label>
                            <input
                                type="text"
                                value={plan.planName}
                                onChange={(e) => handleUpdateField(plan.id, 'planName', e.target.value)}
                                className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 w-full text-white font-bold text-lg focus:border-fuchsia-500/50 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Numeric Configs */}
                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1 tracking-wider">
                                Price (₹)
                            </label>
                            <input
                                type="number"
                                value={plan.priceInINR}
                                onChange={(e) => handleUpdateField(plan.id, 'priceInINR', e.target.value)}
                                className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 w-full text-slate-300 focus:border-fuchsia-500/50 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1 tracking-wider">
                                Credits Awarded
                            </label>
                            <input
                                type="number"
                                value={plan.creditsAwarded}
                                onChange={(e) => handleUpdateField(plan.id, 'creditsAwarded', e.target.value)}
                                className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 w-full text-emerald-400 font-bold focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Marketing Flags */}
                    <div className="mb-6 bg-black/30 p-4 rounded-xl border border-white/5 relative z-10">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={plan.isPopular}
                                onChange={(e) => handleUpdateField(plan.id, 'isPopular', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 focus:ring-2 bg-black accent-fuchsia-500"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">"Most Popular" Highlight</span>
                                <span className="text-xs text-slate-500">Makes the card pop on the public page</span>
                            </div>
                        </label>
                    </div>

                    {/* Bullet Points */}
                    <div className="mb-8 flex-grow relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Public Features List</label>
                            <button onClick={() => handleAddFeature(plan.id)} className="text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 bg-fuchsia-500/10 px-2 py-1 rounded">
                                <Plus className="w-3 h-3" /> Add Feature
                            </button>
                        </div>

                        <div className="space-y-2">
                            {plan.features?.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 group">
                                    <span className="text-emerald-500 font-bold w-4 text-center">+</span>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleUpdateFeature(plan.id, idx, e.target.value)}
                                        className="bg-black/30 border border-white/5 hover:border-white/20 rounded-lg px-3 py-1.5 w-full text-sm text-slate-300 focus:border-fuchsia-500/50 outline-none transition-colors"
                                    />
                                    <button onClick={() => handleRemoveFeature(plan.id, idx)} className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <button
                        onClick={() => handleSave(plan)}
                        disabled={savingId === plan.id}
                        className="w-full mt-auto bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 relative z-10 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                    >
                        <Save className="w-4 h-4" />
                        {savingId === plan.id ? 'Saving Matrix...' : 'Commit to Database'}
                    </button>

                    {/* Decorative Background Element */}
                    {plan.isPopular && (
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-600/10 blur-[50px] rounded-full pointer-events-none z-0"></div>
                    )}
                </div>
            ))}
        </div>
    );
}
