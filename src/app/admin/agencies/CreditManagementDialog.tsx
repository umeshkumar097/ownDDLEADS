'use client';

import { useState } from 'react';
import { Landmark, Coins, ArrowUpRight, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CreditManagementDialogProps {
    agencyId: string;
    agencyName: string;
}

export default function CreditManagementDialog({ agencyId, agencyName }: CreditManagementDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddCredits = async () => {
        if (!amount || isNaN(Number(amount))) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            // Simulated API call - will implement the server action next
            const response = await fetch('/api/admin/agencies/add-credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agencyId, amount: Number(amount) }),
            });

            if (response.ok) {
                toast.success(`Added ${amount} credits to ${agencyName}`);
                setIsOpen(false);
                setAmount('');
            } else {
                throw new Error('Failed to add credits');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-2.5 rounded-xl text-sm font-bold transition-colors border border-cyan-500/20"
            >
                Credits
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 mb-6">
                            <Coins className="w-8 h-8 text-cyan-400" />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">Manage Credits</h2>
                        <p className="text-slate-400 mb-8">Add credits to <span className="text-white font-bold">{agencyName}</span> balance.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Credit Amount</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter credits (e.g. 5000)"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                        Units
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddCredits}
                                disabled={isLoading}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 h-14 rounded-2xl font-black transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ArrowUpRight className="w-5 h-5" />
                                        Add Credits Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
