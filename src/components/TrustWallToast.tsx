'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Zap, TrendingUp } from 'lucide-react';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida', 'Ahmedabad', 'Kolkata'];
const ACTIONS = ['purchased', 'just unlocked', 'secured'];
const AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function TrustWallToast() {
    useEffect(() => {
        // Initial delay before showing the first toast
        const initialDelay = setTimeout(() => {
            showToast();
        }, 3000); // 3 seconds after load

        // Periodic intervals
        const interval = setInterval(() => {
            showToast();
        }, Math.floor(Math.random() * (25000 - 15000 + 1) + 15000)); // Every 15-25 seconds

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    const showToast = () => {
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
        const timeAgo = Math.floor(Math.random() * 15) + 1; // 1 to 15 mins ago

        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-sm w-full bg-slate-900 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative overflow-hidden`}
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-emerald-500"></div>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-indigo-400" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-white">
                                Growth Signal <span className="text-xs text-slate-500 font-normal ml-2">{timeAgo}m ago</span>
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                                Someone from <span className="font-bold text-emerald-400">{city}</span> {action} <span className="font-bold text-white">{amount.toLocaleString()}</span> credits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'bottom-left'
        });
    };

    return null; // Invisible component that just orchestrates background toasts
}
