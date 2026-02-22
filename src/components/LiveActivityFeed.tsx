'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const mockNames = ["Umesh", "Rahul", "Priya", "Amit", "Neha", "Vikram", "Sneha", "Karan", "Pooja", "Arjun"];
const mockCities = ["Noida", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat"];
const mockIndustries = ["Real Estate", "Insurance", "Gym", "Restaurant", "Software", "Manufacturing", "Retail", "Healthcare", "Education", "Automotive"];

export default function LiveActivityFeed() {
    const [isVisible, setIsVisible] = useState(false);
    const [notification, setNotification] = useState({ name: '', city: '', leads: 0, industry: '' });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const triggerNotification = () => {
            const name = mockNames[Math.floor(Math.random() * mockNames.length)];
            const city = mockCities[Math.floor(Math.random() * mockCities.length)];
            const industry = mockIndustries[Math.floor(Math.random() * mockIndustries.length)];
            const leads = Math.floor(Math.random() * 950) + 50; // 50 to 1000 leads

            setNotification({ name, city, leads, industry });
            setIsVisible(true);

            // Hide after 4 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 4000);
        };

        // Initial delay before first popup
        const initialDelay = setTimeout(triggerNotification, 5000);

        // Then pop up randomly every 15-30 seconds
        const randomInterval = setInterval(() => {
            if (!isVisible) {
                triggerNotification();
            }
        }, Math.floor(Math.random() * 15000) + 15000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(randomInterval);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in slide-in-from-left fade-in duration-500 max-w-sm pointer-events-none">
            <div className="bg-slate-900 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)] rounded-2xl p-4 flex items-start gap-4">
                <div className="bg-indigo-500/20 p-2 rounded-full mt-1 shrink-0">
                    <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <p className="text-white text-sm font-medium">
                        <span className="font-bold text-indigo-400">{notification.name}</span> from {notification.city}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                        just extracted <span className="text-emerald-400 font-bold">{notification.leads}</span> {notification.industry} leads.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">Just now</p>
                </div>
            </div>
        </div>
    );
}
