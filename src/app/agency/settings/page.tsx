import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { agencies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Palette, Globe, Upload } from 'lucide-react';
import BrandingSettingsForm from './BrandingSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AgencySettingsPage() {
    const session = await auth();

    if (!session?.user || ((session.user as any).role !== 'agency_admin' && (session.user as any).role !== 'admin')) {
        redirect('/login');
    }

    const agencyId = session.user.agencyId;
    if (!agencyId) {
        return <div>Unauthorized: No agency associated.</div>;
    }

    const [agency] = await db.select().from(agencies).where(eq(agencies.id, agencyId)).limit(1);

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Palette className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Branding Settings</h1>
                    <p className="text-slate-500">Configure your whitelabel identity.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Visual Identity */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Visual Identity</h2>
                    <BrandingSettingsForm agency={agency} />
                </div>

                {/* Domain Info (Read Only for now) */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <h2 className="text-xl font-bold text-slate-900">Domain & Access</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-6">Your agency is currently accessible via the following subdomain.</p>
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subdomain</span>
                            <span className="font-mono text-indigo-600">{agency.subdomain}.dhandaleads.com</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-2">Custom Domain</h3>
                        <p className="text-sm text-slate-500 mb-4">Want to use your own domain like <code>leads.youragency.com</code>? Contact support to enable custom domain mapping.</p>
                        <button disabled className="px-6 py-2.5 bg-slate-200 text-slate-500 rounded-xl text-sm font-bold cursor-not-allowed">
                            Request Custom Domain
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
