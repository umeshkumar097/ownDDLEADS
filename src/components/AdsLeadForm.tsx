"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, ArrowRight, User, Mail, Phone, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdsLeadFormProps {
    sourceKeyword: string;
    sourceCity: string;
}

export default function AdsLeadForm({ sourceKeyword, sourceCity }: AdsLeadFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) return toast.error("Please enter your name");
        if (!formData.email.trim() || !formData.email.includes('@')) return toast.error("Enter a valid email address");
        if (formData.phone.replace(/[^0-9]/g, '').length < 10) return toast.error("Enter a valid 10-digit mobile number");

        setIsLoading(true);
        const toastId = toast.loading("Reserving your access slot...");

        try {
            const res = await fetch('/api/ads-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sourceCity,
                    sourceKeyword
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Access Request Received!", { id: toastId });
                // Redirect to exact thank-you page for Ads Pixel tracking
                router.push('/thank-you');
            } else {
                toast.error(data.error || "Something went wrong. Please try again.", { id: toastId });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Ads Lead Form Submission error", error);
            toast.error("Network error. Please try again.", { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div id="lead-form" className="relative w-full max-w-xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-rose-500/30 overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.3)]">
            {/* Inner background */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>

            <div className="relative bg-slate-950 border border-white/10 rounded-[22px] p-8 md:p-12 z-10 backdrop-blur-xl">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black tracking-widest uppercase mb-6 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                        <Target className="w-4 h-4 fill-rose-400/20" /> Invite-Only Access
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">Request Platform Access</h3>
                    <p className="text-slate-400 font-medium">To protect our dynamic IP pools from spammers, DhandaLeads operates on a curated access model.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Sharma"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Work Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">WhatsApp Number *</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                maxLength={10}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-[72px] pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Company Name (Optional)</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Your Organization"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Submitting Request...</span>
                        ) : (
                            <>
                                Reserve Priority Access <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                        By requesting access, you agree to our exact Zero-Bounce data guarantees and strict anti-spam policies. We do not sell your personal data.
                    </p>

                </form>
            </div>
        </div>
    );
}
