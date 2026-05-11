import { db } from "@/db";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function AgencyHomePage({ params }: { params: { subdomain: string } }) {
    const agency = await db.query.agencies.findFirst({
        where: eq(agencies.subdomain, params.subdomain),
    });

    if (!agency) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {agency.logoUrl ? (
                    <img src={agency.logoUrl} alt={agency.name} className="h-20 mx-auto" />
                ) : (
                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                         <span className="text-4xl font-black text-cyan-400">{agency.name[0]}</span>
                    </div>
                )}
                
                <h1 className="text-5xl font-black tracking-tight leading-tight">
                    Welcome to <span style={{ color: agency.brandColor || '#0ea5e9' }}>{agency.name}</span>
                </h1>
                
                <p className="text-xl text-slate-400 leading-relaxed max-w-lg mx-auto">
                    Powering your business growth with premium lead generation and whitelabel solutions.
                </p>

                <div className="pt-12">
                    <button 
                        className="px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
                        style={{ backgroundColor: agency.brandColor || '#0ea5e9', color: '#000' }}
                    >
                        Get Started Now
                    </button>
                </div>
            </div>
            
            <div className="mt-20 text-slate-600 text-sm font-medium">
                Powered by DhandaLeads Whitelabel
            </div>
        </div>
    );
}
