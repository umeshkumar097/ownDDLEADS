'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <img src="/logo.png" alt="DhandaLeads" className="h-8 w-auto object-contain brightness-0 invert opacity-80 mb-6" />
                    <p className="mb-4 max-w-sm">The smartest B2B data engine for Indian businesses. Find, verify, and close leads on autopilot.</p>
                    <p className="text-white font-bold tracking-wide">A Product of <span className="text-emerald-400">Aiclex Technologies</span></p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Legal & Partners</h4>
                    <ul className="space-y-2">
                        <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/refunds" className="hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
                        <li><Link href="/partnership" className="hover:text-emerald-400 transition-colors">Affiliate Program</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Contact</h4>
                    <ul className="space-y-2">
                        <li><a href="mailto:info@aiclex.in" className="hover:text-emerald-400 transition-colors">info@aiclex.in</a></li>
                        <li><a href="tel:+918449488090" className="hover:text-emerald-400 transition-colors">+91 8449488090</a></li>
                        <li className="text-slate-500 text-sm mt-4">Gaur City Mall, Sec 4, 8125 8th floor, Office Space, Noida 201318, India</li>
                        <li><Link href="/contact" className="hover:text-emerald-400 transition-colors inline-block mt-2">Contact Form</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-4">
                <span>© {new Date().getFullYear()} Aiclex Technologies. All rights reserved.</span>
                <span>Developed by <a href="https://aiclex.in" target="_blank" className="text-emerald-400 hover:text-emerald-300">aiclex.in</a></span>
            </div>
        </footer>
    );
}
