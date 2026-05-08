'use client';

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { updateBranding } from './actions';

export default function BrandingSettingsForm({ agency }: { agency: any }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        const formData = new FormData(e.currentTarget);
        
        try {
            await updateBranding(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            alert("Failed to update branding.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agency Display Name</label>
                    <input 
                        name="name" 
                        defaultValue={agency.name}
                        required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brand Primary Color</label>
                    <div className="flex gap-3">
                        <input 
                            name="brandColor" 
                            type="color"
                            defaultValue={agency.brandColor || '#0f172a'}
                            className="w-12 h-12 rounded-lg cursor-pointer border-none p-0"
                        />
                        <input 
                            name="brandColorText" 
                            defaultValue={agency.brandColor || '#0f172a'}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo URL</label>
                <input 
                    name="logoUrl" 
                    defaultValue={agency.logoUrl || ''}
                    placeholder="https://yourdomain.com/logo.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-[10px] text-slate-400 mt-2">Recommended: Transparent PNG, 400x80px.</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Favicon URL</label>
                <input 
                    name="faviconUrl" 
                    defaultValue={agency.faviconUrl || ''}
                    placeholder="https://yourdomain.com/favicon.ico"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                        success ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-indigo-950 text-white shadow-indigo-200'
                    } shadow-lg hover:-translate-y-0.5`}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (success ? <Check className="w-5 h-5" /> : 'Save Branding Changes')}
                </button>
            </div>
        </form>
    );
}
