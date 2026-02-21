'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image src="/logo.png" width={200} height={40} priority={true} alt="Aiclex | DhandaLeads" className="h-10 w-auto object-contain" />
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/#features" className="hover:text-emerald-700 transition-colors">Features</Link>
                    <Link href="/pricing" className="hover:text-emerald-700 transition-colors">Pricing</Link>
                    <Link href="/about" className="hover:text-emerald-700 transition-colors">About Us</Link>
                    <Link href="/contact" className="hover:text-emerald-700 transition-colors">Contact</Link>
                    <Link href="/partnership" className="hover:text-emerald-700 transition-colors flex items-center gap-1 font-bold">
                        Earn & Scale <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden md:block text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm font-bold px-6 py-2.5 bg-indigo-950 text-white hover:bg-emerald-700 rounded-full transition-all shadow-md hover:shadow-lg">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
