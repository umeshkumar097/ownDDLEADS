'use client';

import { Suspense } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

function HeroTextInner() {
    const geo = useGeolocation();
    const city = geo.city ? geo.city : 'India';

    return (
        <>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-indigo-950 leading-[1.1] max-w-5xl mx-auto transition-all duration-700">
                Ab Har <span className="text-emerald-700">{city}</span> Business Banega International Brand.<br />
                <span className="text-indigo-900">Get 10x Quality Leads on Autopilot.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 transition-all duration-700">
                Stop chasing dead numbers. Leverage enterprise-grade AI to find, verify, and connect with decision-makers directly in {city}.
            </p>
        </>
    );
}

export default function DynamicHeroText() {
    return (
        <Suspense fallback={
            <>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-indigo-950 leading-[1.1] max-w-5xl mx-auto">
                    Ab Har <span className="text-emerald-700">India</span> Business Banega International Brand.<br />
                    <span className="text-indigo-900">Get 10x Quality Leads on Autopilot.</span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Stop chasing dead numbers. Leverage enterprise-grade AI to find, verify, and connect with decision-makers directly in India.
                </p>
            </>
        }>
            <HeroTextInner />
        </Suspense>
    );
}
