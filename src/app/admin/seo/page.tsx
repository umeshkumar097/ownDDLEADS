'use client';

import { useState, useEffect } from 'react';
import {
    getSeoMetadata,
    toggleSeoCity,
    toggleSeoKeyword,
    updateSeoKeywordContext,
    addSeoCity,
    addSeoKeyword,
    bulkAddSeoCities,
    bulkAddSeoKeywords
} from '@/app/admin/actions';
import { MapPin, Key, Plus, Save, Power, PowerOff, Loader2, ExternalLink, UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SEOAdminPage() {
    const [cities, setCities] = useState<any[]>([]);
    const [keywords, setKeywords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [newCityName, setNewCityName] = useState('');
    const [newCityState, setNewCityState] = useState('');
    const [newKeyword, setNewKeyword] = useState('');
    const [newIntentHeadline, setNewIntentHeadline] = useState('');

    const [bulkCitiesText, setBulkCitiesText] = useState('');
    const [bulkKeywordsText, setBulkKeywordsText] = useState('');

    const [editingContextId, setEditingContextId] = useState<number | null>(null);
    const [editingContextValue, setEditingContextValue] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getSeoMetadata();
            setCities(data.cities);
            setKeywords(data.keywords);
        } catch (error) {
            toast.error("Failed to load SEO metadata");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCityToggle = async (id: number, current: boolean) => {
        const loadingToast = toast.loading('Toggling city...');
        try {
            await toggleSeoCity(id, current);
            toast.success('City toggled', { id: loadingToast });
            loadData();
        } catch (error) {
            toast.error('Failed to toggle', { id: loadingToast });
        }
    };

    const handleKeywordToggle = async (id: number, current: boolean) => {
        const loadingToast = toast.loading('Toggling keyword...');
        try {
            await toggleSeoKeyword(id, current);
            toast.success('Keyword toggled', { id: loadingToast });
            loadData();
        } catch (error) {
            toast.error('Failed to toggle', { id: loadingToast });
        }
    };

    const handleSaveContext = async (id: number) => {
        const loadingToast = toast.loading('Saving context paragraph...');
        try {
            await updateSeoKeywordContext(id, editingContextValue);
            toast.success('Context saved successfully!', { id: loadingToast });
            setEditingContextId(null);
            loadData();
        } catch (error) {
            toast.error('Failed to save context', { id: loadingToast });
        }
    };

    const handleAddCity = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding city...');
        const res = await addSeoCity(newCityName, newCityState);
        if (res.success) {
            toast.success('City added', { id: loadingToast });
            setNewCityName('');
            setNewCityState('');
            loadData();
        } else {
            toast.error(res.error || 'Failed to add', { id: loadingToast });
        }
    };

    const handleAddKeyword = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding keyword...');
        const res = await addSeoKeyword(newKeyword, newIntentHeadline);
        if (res.success) {
            toast.success('Keyword added', { id: loadingToast });
            setNewKeyword('');
            setNewIntentHeadline('');
            loadData();
        } else {
            toast.error(res.error || 'Failed to add', { id: loadingToast });
        }
    };

    const handleBulkCities = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkCitiesText.trim()) return;
        const loadingToast = toast.loading('Bulk adding cities...');
        const res = await bulkAddSeoCities(bulkCitiesText);
        toast.success(`Bulk Added ${res.count} Cities`, { id: loadingToast });
        setBulkCitiesText('');
        loadData();
    };

    const handleBulkKeywords = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkKeywordsText.trim()) return;
        const loadingToast = toast.loading('Bulk adding keywords...');
        const res = await bulkAddSeoKeywords(bulkKeywordsText);
        toast.success(`Bulk Added ${res.count} Keywords`, { id: loadingToast });
        setBulkKeywordsText('');
        loadData();
    };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center min-h-screen text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">SEO Context Engine {`{Phase 11}`}</h1>
            <p className="text-slate-400 mb-8 border-b border-white/10 pb-6">Dynamically manage local cities, programmatic keywords, and landing page matrices across 1000+ permutations.</p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Keywords Settings */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-400" />
                        Target Keywords Matrix ({keywords.length})
                    </h2>

                    <form onSubmit={handleAddKeyword} className="mb-6 bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Core Keyword (e.g. Lead Generation Specialists)"
                                className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="H1 Headline (e.g. The #1 Specialist)"
                                className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                value={newIntentHeadline}
                                onChange={(e) => setNewIntentHeadline(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Add Keyword Pattern
                        </button>
                    </form>

                    {/* Bulk Keyword Upload */}
                    <form onSubmit={handleBulkKeywords} className="mb-8 bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <textarea
                            placeholder="Format: Keyword1 | Headline1&#10;Keyword2 | Headline2"
                            className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                            rows={3}
                            value={bulkKeywordsText}
                            onChange={(e) => setBulkKeywordsText(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-slate-800 hover:bg-indigo-600 border border-white/10 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <UploadCloud className="w-4 h-4" /> Bulk Upload Keywords
                        </button>
                    </form>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {keywords.map((kw) => (
                            <div key={kw.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-emerald-400 text-xs font-mono mb-1">/solutions/{kw.slug}/[city]</div>
                                        <h3 className="font-bold text-white">{kw.keyword}</h3>
                                        <p className="text-sm text-slate-400 mt-1">H1: {kw.intentHeadline} <span className="text-indigo-300">in [City]</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={`/solutions/${kw.slug}/india`} target="_blank" className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-colors" title="Live Preview">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleKeywordToggle(kw.id, kw.isActive)}
                                            className={`p-2 rounded-lg transition-colors ${kw.isActive ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                        >
                                            {kw.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {editingContextId === kw.id ? (
                                    <div className="bg-black/50 p-3 rounded-lg border border-indigo-500/30">
                                        <textarea
                                            className="w-full bg-slate-900 border border-white/10 rounded-md p-2 text-white text-sm focus:outline-none mb-3 min-h-[80px]"
                                            value={editingContextValue}
                                            onChange={(e) => setEditingContextValue(e.target.value)}
                                            placeholder="Write contextual paragraph..."
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => setEditingContextId(null)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-md">Cancel</button>
                                            <button onClick={() => handleSaveContext(kw.id)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-md flex items-center gap-1"><Save className="w-3 h-3" /> Save Details</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="bg-black/20 p-3 rounded-lg text-sm text-slate-500 italic cursor-pointer hover:bg-black/40 border border-transparent hover:border-white/5 transition-colors group"
                                        onClick={() => {
                                            setEditingContextValue(kw.contextParagraph || '');
                                            setEditingContextId(kw.id);
                                        }}
                                    >
                                        {kw.contextParagraph || "Click to add a dynamic context paragraph for this keyword matrix..."}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities Targets */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        Target Cities ({cities.length})
                    </h2>

                    <form onSubmit={handleAddCity} className="mb-6 bg-black/40 p-4 rounded-xl border border-white/5 flex gap-3">
                        <input
                            type="text"
                            placeholder="City (e.g. Pune)"
                            className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 flex-1 w-1/2"
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State/Region"
                            className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 flex-1 w-1/2"
                            value={newCityState}
                            onChange={(e) => setNewCityState(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded-lg flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Bulk City Upload */}
                    <form onSubmit={handleBulkCities} className="mb-8 bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <textarea
                            placeholder="Format: City1, State1&#10;City2, State2"
                            className="bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                            rows={3}
                            value={bulkCitiesText}
                            onChange={(e) => setBulkCitiesText(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-slate-800 hover:bg-emerald-600 border border-white/10 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <UploadCloud className="w-4 h-4" /> Bulk Upload Cities
                        </button>
                    </form>

                    <div className="bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left bg-slate-900">
                                <thead className="bg-slate-800 text-slate-400 text-xs uppercase sticky top-0 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">City</th>
                                        <th className="px-6 py-4 font-semibold">State</th>
                                        <th className="px-6 py-4 font-semibold text-right">Route Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cities.map((city) => (
                                        <tr key={city.id} className="border-b border-white/5 hover:bg-slate-800/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{city.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{city.state}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleCityToggle(city.id, city.isActive)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${city.isActive ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                                                >
                                                    {city.isActive ? 'ACTIVE_URL' : 'DISINHERITED'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
