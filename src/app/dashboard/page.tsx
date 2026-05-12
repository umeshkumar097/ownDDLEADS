'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Users, SearchCode, Lock, Building2, PhoneCall, Mail, ExternalLink, Download, LayoutGrid, CheckCircle2, ChevronRight, Activity, FolderPlus, Trash2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import toast, { Toaster } from 'react-hot-toast';
import FloatingAIWidget from '@/components/FloatingAIWidget';
import FullPageLoader from '@/components/FullPageLoader';
import WelcomeOfferPopup from '@/components/WelcomeOfferPopup';
import AdsWelcomeOffer from '@/components/AdsWelcomeOffer';
import PhoneCollectModal from '@/components/PhoneCollectModal';

export default function DashboardPage() {
    return (
        <Suspense fallback={<FullPageLoader message="Loading Dashboard..." />}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [leads, setLeads] = useState<any[]>([]); // Unlocked leads
    const [bulkLeads, setBulkLeads] = useState<any[]>([]); // Search results
    const [lists, setLists] = useState<any[]>([]); // User folders
    const [selectedListId, setSelectedListId] = useState<string>('');
    const [newListName, setNewListName] = useState<string>('');
    const [credits, setCredits] = useState<number | string>('...');
    const [userData, setUserData] = useState<{ emailVerified: string | null, hasPurchased: boolean, membershipType: string } | null>(null);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [userName, setUserName] = useState('');

    const [loading, setLoading] = useState(false);
    const [jobRole, setJobRole] = useState('');
    const [location, setLocation] = useState('');
    const [viewMode, setViewMode] = useState<'search' | 'list'>('list');
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
    const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);

    // Protect route and load library
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchLibrary();

            if (searchParams?.get('error') === 'UnauthorizedAdmin') {
                toast.error("Access Denied: You must be logged in as the Admin (info@aiclex.in). Please logout first.");
            }
        }
    }, [status, router, searchParams]);

    const fetchLibrary = async () => {
        try {
            const res = await fetch('/api/library');
            const data = await res.json();
            if (data.success) {
                setLists(data.lists);
                setLeads(data.leads);
                setCredits(data.credits);
                setUserName(data.user?.name || '');
                setUserData({
                    emailVerified: data.user?.emailVerified || null,
                    hasPurchased: data.user?.hasPurchased || false,
                    membershipType: data.user?.membershipType || 'free'
                });
                // Show phone modal for Google users who have no phone number
                if (data.user?.isGoogleUser && !data.user?.phone) {
                    setShowPhoneModal(true);
                }
                if (data.lists.length > 0) setSelectedListId(data.lists[0].id);
            }
        } catch (e) {
            console.error('Failed to load library');
        }
    };

    const handleSavePhone = async (phone: string) => {
        const res = await fetch('/api/user/update-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });
        if (res.ok) {
            setShowPhoneModal(false);
            toast.success('Mobile number saved successfully!');
        } else {
            throw new Error('Failed to save');
        }
    };

    const handleSearch = async (loadMoreToken: string | null = null) => {
        setLoading(true);
        if (!loadMoreToken) {
            setViewMode('search');
            setBulkLeads([]);
            setSelectedLeads(new Set());
        }
        try {
            const res = await fetch('/api/search-audience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetJobRole: jobRole, targetLocation: location, pageToken: loadMoreToken }),
            });
            const data = await res.json();
            if (res.ok && data.results) {
                if (loadMoreToken) {
                    setBulkLeads(prev => [...prev, ...data.results]);
                } else {
                    setBulkLeads(data.results);
                }
                setNextPageToken(data.nextPageToken || null);
                if (!loadMoreToken) {
                    toast.success(`Found ${data.count} potential leads!`);
                }
            } else {
                toast.error(data.error || 'Failed to search.');
            }
        } catch (err) {
            toast.error('Search Failed');
        }
        setLoading(false);
    };

    const handleUnlockLead = async (bulkLead: any) => {
        // Default folder behavior removed, all leads go to library


        const toastId = toast.loading('Unlocking and analyzing lead...');

        try {
            const res = await fetch('/api/unlock-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload: bulkLead._rawPayload,
                    listId: null,
                    listName: 'Main Library'
                })
            });
            const data = await res.json();

            if (res.ok && data.lead) {
                toast.success('Lead Unlocked & Saved!', { id: toastId });
                // Remove from bulk pool
                setBulkLeads(prev => prev.filter(l => l.id !== bulkLead.id));
                // Add to unlocked library
                setLeads(prev => [data.lead, ...prev]);

                // If we created a new list, refresh the library to get its ID
                if (newListName && !selectedListId) {
                    fetchLibrary();
                    setNewListName('');
                }
            } else {
                toast.error(data.error || 'Failed to unlock lead.', { id: toastId });
            }
        } catch (err) {
            toast.error('Unlock Failed', { id: toastId });
        }
    };

    const handleBulkUnlock = () => {
        if (selectedLeads.size === 0) return;
        // Default folder behavior


        setShowBulkConfirmModal(true);
    };

    const executeBulkUnlock = async () => {
        setShowBulkConfirmModal(false);
        const toastId = toast.loading(`Unlocking ${selectedLeads.size} leads...`);

        let successCount = 0;
        let failCount = 0;
        const leadsToUnlock = bulkLeads.filter(l => selectedLeads.has(l.id));

        for (const bulkLead of leadsToUnlock) {
            try {
                const res = await fetch('/api/unlock-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payload: bulkLead._rawPayload,
                        listId: null,
                        listName: 'Main Library'
                    })
                });
                const data = await res.json();

                if (res.ok && data.lead) {
                    successCount++;
                    setBulkLeads(prev => prev.filter(l => l.id !== bulkLead.id));
                    setLeads(prev => [data.lead, ...prev]);
                } else {
                    failCount++;
                }
            } catch (err) {
                failCount++;
            }
        }

        // No list refresh needed


        setSelectedLeads(new Set());

        if (successCount > 0) {
            toast.success(`Successfully unlocked ${successCount} leads! ${failCount > 0 ? `(${failCount} failed)` : ''}`, { id: toastId });
        } else {
            toast.error(`Failed to unlock leads.`, { id: toastId });
        }
    };

    const toggleLeadSelection = (leadId: string) => {
        const newSelected = new Set(selectedLeads);
        if (newSelected.has(leadId)) {
            newSelected.delete(leadId);
        } else {
            newSelected.add(leadId);
        }
        setSelectedLeads(newSelected);
    };

    const toggleAllLeads = () => {
        if (selectedLeads.size === bulkLeads.length && bulkLeads.length > 0) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(bulkLeads.map(l => l.id)));
        }
    };


    const handleDeleteLead = async (leadId: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        const toastId = toast.loading('Deleting lead...');
        try {
            const res = await fetch(`/api/leads?id=${leadId}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== leadId));
                toast.success('Lead deleted!', { id: toastId });
            } else {
                toast.error('Failed to delete lead.', { id: toastId });
            }
        } catch (err) {
            toast.error('Error deleting lead.', { id: toastId });
        }
    };

    const handleExportCSV = () => {
        if (leads.length === 0) {
            toast.error('No unlocked leads to export');
            return;
        }
        const csvData = leads.map(l => ({
            Name: l.name, Email: l.email, Phone: l.phone || 'N/A', Role: l.role,
            Company: l.company, Location: l.location, LinkedIn: l.linkedin,
            'AI Icebreaker': l.icebreaker || 'N/A',
            'Valid Email': l.emailVerified ? 'Yes' : 'No',
            'Valid LinkedIn': l.linkedinValid ? 'Yes' : 'No'
        }));
        const csvString = Papa.unparse(csvData);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `nexus_leads_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const displayedLeads = leads; // Show all leads without folder filtering


    if (status === 'loading') return <FullPageLoader message="Authenticating Command Center..." />;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .mesh-gradient {
                    background-color: #020617;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%);
                }
            `}</style>
            <div className="fixed inset-0 mesh-gradient -z-10" />
            <Toaster position="bottom-right" />
            
            {/* Navbar */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl fixed top-0 w-full z-[50] transition-all"
            >
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Image src="/logo.png" width={160} height={40} alt="DhandaLeads" className="h-9 w-auto object-contain cursor-pointer transform hover:scale-105 transition-transform" />
                        
                        <div className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/5 rounded-2xl p-1">
                             <button className="px-4 py-1.5 text-xs font-bold bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">Discovery</button>
                             <button onClick={() => router.push('/dashboard/wallet')} className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">Billing</button>
                             <button onClick={() => router.push('/dashboard/partnership')} className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">Affiliate</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Command Center</span>
                            <span className="text-sm text-white font-medium">{session?.user?.name || 'User'}</span>
                        </div>

                        <div className="h-10 w-[1px] bg-white/10 hidden md:block mx-2" />

                        <button onClick={() => router.push('/dashboard/api-keys')} className="p-2.5 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-white/5 rounded-xl transition-all hidden lg:flex" title="API Keys">
                            <Lock className="w-5 h-5" />
                        </button>

                        <button onClick={() => signOut()} className="px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">Logout</button>
                        
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] hidden sm:block">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-sm font-black">
                                {session?.user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Main Content Area */}
            <main className="max-w-[1400px] mx-auto px-6 pt-24 pb-20 flex flex-col gap-8">
                
                {/* COMPACT STATS BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-6 px-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Available Fuel</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black tracking-tighter ${typeof credits === 'number' && credits < 10 ? 'text-rose-400' : 'text-white'}`}>{credits}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Credits</span>
                            </div>
                        </div>
                        
                        <div className="h-8 w-[1px] bg-white/10" />
                        
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.push('/dashboard/wallet')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            + Load Credits
                        </button>
                        <button 
                            onClick={() => router.push('/dashboard/api-keys')}
                            className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5"
                            title="API Keys"
                        >
                            <Lock className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Audience Discovery Area */}
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Business Discovery</h1>
                        <p className="text-slate-500 max-w-xl text-base font-medium">Find and extract leads from any industry or business category worldwide.</p>
                    </div>

                    {/* Search Engine Area */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition-opacity" />
                        
                        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                <div className="lg:col-span-5 relative">
                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                    <input
                                        type="text"
                                        placeholder="Business Category (e.g. Digital Marketing, Real Estate)"
                                        value={jobRole}
                                        onChange={e => setJobRole(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white text-base placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                                
                                <div className="lg:col-span-4 relative">
                                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                    <input
                                        type="text"
                                        placeholder="Location (e.g. Delhi, Noida, Bangalore)"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white text-base placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>

                                <div className="lg:col-span-3">
                                    <button
                                        onClick={() => handleSearch(null)}
                                        disabled={loading || jobRole.trim().length < 3 || location.trim().length < 3}
                                        className="w-full bg-white text-black hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl py-5 px-6 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><SearchCode className="w-5 h-5" /> Get Leads</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* View Toggles */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-white/10 gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {viewMode === 'search' ? 'Discovery Results' : 'Saved Leads'}
                            </h2>
                            {viewMode === 'search' && selectedLeads.size > 0 && (
                                <button
                                    onClick={handleBulkUnlock}
                                    className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(79,70,229,0.5)] flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" /> Unlock Selected ({selectedLeads.size})
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4 items-center">
                            {viewMode === 'list' && displayedLeads.length > 0 && (
                                <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all">
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            )}
                            <div className="bg-black/40 border border-white/10 rounded-lg p-1 flex">
                                <button onClick={() => setViewMode('search')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${viewMode === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>New Search ({bulkLeads.length})</button>
                                <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Saved Leads</button>
                            </div>
                        </div>
                    </div>

                    {/* Search Discovery Mode (Locked Bulk Results) */}
                    {viewMode === 'search' && (
                        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="py-4 px-4 w-12 text-center text-sm font-medium text-slate-400">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 w-4 h-4 cursor-pointer"
                                                    onChange={toggleAllLeads}
                                                    checked={selectedLeads.size === bulkLeads.length && bulkLeads.length > 0}
                                                />
                                            </th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400">Prospect</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400">Masked Contact</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400 text-center">Data Points</th>
                                            <th className="py-4 px-6 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {bulkLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center text-slate-500">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <SearchCode className="w-10 h-10 text-slate-800" />
                                                        <p>Run a Get Leads to extract up to 25 leads at once.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            bulkLeads.map((lead) => (
                                                <tr key={lead.id} className={`hover:bg-indigo-900/10 transition-colors group ${selectedLeads.has(lead.id) ? 'bg-indigo-900/20' : ''}`}>
                                                    <td className="py-4 px-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 w-4 h-4 cursor-pointer"
                                                            checked={selectedLeads.has(lead.id)}
                                                            onChange={() => toggleLeadSelection(lead.id)}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-white mb-1">{lead.name}</div>
                                                        <div className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md inline-block mt-1">{lead.role}</div>
                                                    </td>
                                                    <td className="py-4 px-6 font-mono text-xs text-slate-500 space-y-1">
                                                        <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> Unlock verified Email & LinkedIn</div>
                                                        <div className="flex items-center gap-2 mb-6"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> Export to CRM or CSV</div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">Email</span>
                                                            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">Phone</span>
                                                            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">LinkedIn</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => handleUnlockLead(lead)}
                                                            className="text-xs font-bold text-indigo-300 bg-indigo-900/40 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg transition-all border border-indigo-500/30 shadow-[0_0_15px_-5px_rgba(79,70,229,0.5)]"
                                                        >
                                                            Unlock (1.5 Credits)
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        {nextPageToken && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center bg-white/[0.01]">
                                                    <button
                                                        onClick={() => handleSearch(nextPageToken)}
                                                        disabled={loading}
                                                        className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-bold px-8 py-3 rounded-xl border border-indigo-500/30 transition-all shadow-[0_0_15px_-5px_rgba(79,70,229,0.3)] disabled:opacity-50"
                                                    >
                                                        {loading ? 'Fetching more leads...' : 'Load Next 20 Leads'}
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                    {/* Unlocked List Mode */}
                    {viewMode === 'list' && (
                        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400">Contact Person</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400">Contact Detail</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400">Business & Category</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400 text-center">AI Verification</th>
                                            <th className="py-4 px-6 text-sm font-medium text-slate-400 text-right">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayedLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center text-slate-500">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <Activity className="w-10 h-10 text-slate-800" />
                                                        <p>You haven't unlocked any leads in this folder yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            displayedLeads.map((lead, idx) => (
                                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="py-4 px-6">
                                                        <div className="font-medium text-white">{lead.name}</div>
                                                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Profile
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="text-sm">{lead.email}</div>
                                                        {lead.phone && <div className="text-xs text-slate-400 mt-1">{lead.phone}</div>}
                                                        <a href={lead.linkedin} target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block">LinkedIn Profile ↗</a>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="font-medium text-slate-300">{lead.company}</div>
                                                        <div className="text-sm text-indigo-400 font-medium">{lead.role}</div>
                                                        <div className="text-[10px] text-slate-600 uppercase tracking-tighter mt-1">{lead.location}</div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${lead.emailVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}><CheckCircle2 className="w-3 h-3" /> Email</div>
                                                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${lead.linkedinValid ? 'bg-emerald-500/10 border-linkedin-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}><CheckCircle2 className="w-3 h-3" /> LinkedIn</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button onClick={() => handleDeleteLead(lead.id)} className="text-slate-500 hover:text-rose-400 p-2 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <FloatingAIWidget leadsCount={leads.length} />

            {/* Premium Bulk Confirm Modal */}
            {showBulkConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-700/50 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
                        {/* Premium header accent */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

                        <div className="mx-auto bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-indigo-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-white text-center mb-2">
                            Confirm Bulk Extraction
                        </h3>
                        <p className="text-slate-400 text-center mb-8">
                            You are about to unlock <span className="text-white font-bold">{selectedLeads.size}</span> high-quality verified leads. This will consume <span className="text-rose-400 font-bold">{(selectedLeads.size * 1.5).toFixed(1)} credits</span> from your balance.
                        </p>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowBulkConfirmModal(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeBulkUnlock}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Collection Modal — for Google OAuth users */}
            {showPhoneModal && (
                <PhoneCollectModal onSubmit={handleSavePhone} userName={userName} />
            )}

            {/* Phase 17 Welcome Offer */}
            {userData?.emailVerified && (
                <WelcomeOfferPopup
                    hasPurchased={userData.hasPurchased}
                    emailVerifiedAt={userData.emailVerified}
                />
            )}
        </div>
    );
}
