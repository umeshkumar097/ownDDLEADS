'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { createAgency } from './actions';
import { useRouter } from 'next/navigation';

export default function CreateAgencyButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await createAgency(formData);
            setIsOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to create agency. Make sure subdomain is unique.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/20"
            >
                <Plus className="w-5 h-5" />
                Create New Agency
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">New Whitelabel Partner</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agency Name</label>
                                <input 
                                    name="name" 
                                    required 
                                    placeholder="e.g. Acme Marketing"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subdomain</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        name="subdomain" 
                                        required 
                                        placeholder="acme"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                    <span className="text-slate-500 text-sm">.dhandaleads.com</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
                                <input 
                                    name="email" 
                                    type="email"
                                    required 
                                    placeholder="owner@agency.com"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                                <p className="text-[10px] text-slate-500 mt-2">User must already exist or will be promoted to Agency Admin.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Initialize'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
