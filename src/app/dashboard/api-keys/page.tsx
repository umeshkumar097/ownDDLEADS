import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ApiKeyManager from './ApiKeyManager';
import { ShieldAlert, TerminalSquare, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default async function ApiKeysPage() {
    const session = await auth();
    if (!session || !session.user) return redirect('/login');

    const keys = await db.select().from(apiKeys).where(eq(apiKeys.userId, session.user.id!));
    const activeKey = keys.length > 0 ? keys[0] : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Toaster position="bottom-right" />
            <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg fixed top-0 w-full z-10 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <Image src="/logo.png" width={140} height={35} alt="DhandaLeads" className="h-7 w-auto object-contain cursor-pointer transform hover:scale-105 transition-transform" />
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-24 pb-20 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">Developer API</h1>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <TerminalSquare className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-xl font-bold">Secret Token Management</h2>
                    </div>

                    <p className="text-slate-400 mb-6 max-w-2xl">
                        Generate an API secret to access the DhandaLeads programmatic data endpoints. Keep this key safe. Do not expose it in client-side code (browsers/frontend apps).
                    </p>

                    <ApiKeyManager hasKey={!!activeKey} lastUsed={activeKey?.lastUsedAt} createdAt={activeKey?.createdAt} />
                </div>

                <div className="bg-blue-900/10 border border-blue-900/40 rounded-xl p-6 relative overflow-hidden">
                    <ShieldAlert className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/10" />
                    <h3 className="text-lg font-bold text-blue-400 mb-3 relative z-10">Integration Endpoint</h3>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto relative z-10 mb-4">
                        POST https://dhandaleads.com/api/v1/leads/search
                    </div>
                    <p className="text-slate-400 text-sm relative z-10">Required Header: <code>Authorization: Bearer ddl_...</code></p>
                    <p className="text-slate-400 text-sm relative z-10 mt-2">Required Body: <code>{`{ "city": "Delhi", "industry": "Software", "limit": 100 }`}</code></p>
                </div>
            </main>
        </div>
    );
}
