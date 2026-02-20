import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans leading-relaxed selection:bg-indigo-500/30">
            <Navbar />
            <div className="max-w-3xl mx-auto py-10 pt-32 px-10">
                <h1 className="text-4xl font-black mb-6 border-b border-white/10 pb-4">Privacy Policy</h1>

                <p className="text-slate-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">1. Information We Collect</h2>
                    <p className="text-slate-300">We collect email addresses and names directly when you register. Authentication is handled securely via Google.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">2. How We Source B2B Data</h2>
                    <p className="text-slate-300">DhandaLeads uses advanced proxies and LLMs to organize publicly available business contact information across the web. We do not sell sensitive personal identifying information (PII).</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">3. Opt-out Rights</h2>
                    <p className="text-slate-300 mb-4 bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/20">
                        If you have discovered your business email or information indexed in our B2B dataset and wish to have it removed or claim ownership, please email us directly at <strong>opt-out@nexuslead.ai</strong>. We will permanently block your domain or address within 72 hours.
                    </p>
                </section>

                <div className="mt-12">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium underline">← Back to Home</Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
