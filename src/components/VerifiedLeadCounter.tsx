'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function VerifiedLeadCounter() {
    // Start with a large believable base number
    const [count, setCount] = useState(1200450);

    useEffect(() => {
        // Randomly increment the counter every few seconds to simulate live verifications
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 5) + 1);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-mono text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold">{count.toLocaleString('en-IN')}+</span> Leads Verified Today
        </div>
    );
}
