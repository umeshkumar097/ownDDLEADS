import { getActiveBroadcast } from "@/app/admin/actions";
import { Megaphone } from "lucide-react";

export default async function BroadcastBanner() {
    const message = await getActiveBroadcast();

    if (!message) return null;

    return (
        <div className="bg-indigo-600 px-4 py-3 text-white flex items-center justify-center gap-3 relative shadow-md z-50">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 mix-blend-overlay pointer-events-none" />
            <Megaphone className="w-5 h-5 animate-pulse relative z-10" />
            <p className="font-bold text-sm md:text-base relative z-10 drop-shadow-sm flex-1 text-center">
                {message}
            </p>
            <div className="w-5 h-5" /> {/* Spacer for centering */}
        </div>
    );
}
