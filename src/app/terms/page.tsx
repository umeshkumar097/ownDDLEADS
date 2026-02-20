import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans leading-relaxed selection:bg-indigo-500/30">
            <Navbar />
            <div className="max-w-3xl mx-auto py-10 pt-32 px-10">
                <h1 className="text-4xl font-black mb-6 border-b border-white/10 pb-4">Terms of Service</h1>

                <p className="text-slate-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">1. Acceptance of Terms</h2>
                    <p className="text-slate-300">By accessing DhandaLeads (Aiclex Technologies), you agree to be bound by these Terms. If you disagree, do not use our services.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">2. Data Sourcing & Compliance</h2>
                    <p className="text-slate-300 mb-4">You understand that all data extracted via our platform is obtained from publicly available sources on the internet, formatted for B2B usage.</p>
                    <p className="text-slate-300">We do not extract or interact directly with private databases without authorization. It is solely your responsibility to use this data ethically and comply with CAN-SPAM, GDPR, or similar regional laws when sending outreach emails.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">3. Wallet System & Use Limits</h2>
                    <p className="text-slate-300">Our platform operates on a pre-paid Credit Wallet system. All users must maintain a positive credit balance to utilize the platform's features. Abusive behavior (such as attempting to bypass payment gateways or reverse engineer our extraction engines) will result in immediate account termination without a refund.</p>
                </section>

                <div className="mt-12">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium underline">← Back to Home</Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
