'use client';

import { Activity, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-400">We're here to help you scale your outreach</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-2xl font-bold mb-6">Aiclex Technologies</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-indigo-400 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-300 mb-1">Email Support</h3>
                                    <a href="mailto:info@aiclex.in" className="text-indigo-400 hover:text-indigo-300">info@aiclex.in</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="w-6 h-6 text-indigo-400 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-300 mb-1">Phone</h3>
                                    <a href="tel:+918449488090" className="text-indigo-400 hover:text-indigo-300">+91 8449488090</a>
                                    <p className="text-sm text-slate-500 mt-1">Available Mon-Fri, 10:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-indigo-400 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-300 mb-1">Registered Address</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Gaur City Mall, Sec 4, 8125 8th floor<br />
                                        Office Space, Noida 201318<br />
                                        India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="bg-black/30 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! Our team will contact you soon.'); }}>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input type="text" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <input type="email" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="john@company.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                                <textarea required rows={4} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
