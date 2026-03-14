import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FounderImage from '@/components/FounderImage';
import { Linkedin } from 'lucide-react';
import Script from 'next/script';

export const metadata = {
    title: 'About Aiclex Technologies — Founders Behind DhandaLeads',
    description: 'Meet Umesh Kumar, founder of Aiclex Technologies and DhandaLeads. With 8+ years in digital marketing and AI automation, we build India\'s most trusted B2B lead generation platform.',
    keywords: ['Aiclex Technologies', 'Umesh Kumar', 'DhandaLeads founder', 'B2B lead generation company India', 'Aiclex Technologies New Delhi'],
    openGraph: {
        title: 'About Aiclex Technologies — Founders Behind DhandaLeads',
        description: 'Meet the team building India\'s most powerful B2B data engine.',
        url: 'https://dhandaleads.com/about',
    },
    alternates: { canonical: 'https://dhandaleads.com/about' }
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Umesh Kumar",
    "jobTitle": "Founder & CEO",
    "url": "https://linkedin.com/in/iukbsr",
    "sameAs": ["https://linkedin.com/in/iukbsr", "https://aiclex.in"],
    "worksFor": {
        "@type": "Organization",
        "name": "Aiclex Technologies",
        "url": "https://dhandaleads.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "A-116/117, Okhla Phase II",
            "addressLocality": "New Delhi",
            "postalCode": "110020",
            "addressCountry": "IN"
        }
    },
    "knowsAbout": ["B2B Lead Generation", "Digital Marketing", "AI Automation", "SaaS", "Sales Technology"]
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500/30">
            <Script id="person-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="flex flex-col items-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center mb-4">
                        About <span className="text-indigo-600">Us</span>
                    </h1>
                    <p className="text-lg text-slate-600 text-center max-w-2xl">
                        Aiclex Technologies is driven by a strong vision of innovation, performance, and scalable digital solutions.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto overflow-hidden relative">
                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                    {/* Image Placeholder */}
                    <div className="w-full md:w-1/3 flex justify-center relative z-10">
                        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl bg-slate-100 flex items-center justify-center relative">
                            {/* Assuming the user will place the image at /founder.png */}
                            <FounderImage />
                        </div>
                    </div>

                    {/* Biography Content */}
                    <div className="w-full md:w-2/3 flex flex-col justify-center relative z-10">
                        <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">
                            Founder & Visionary
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                            Umesh Kumar
                        </h2>

                        <a
                            href="https://linkedin.com/in/iukbsr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold mb-6 w-fit transition-colors group"
                        >
                            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            linkedin.com/in/iukbsr
                        </a>

                        <div className="h-1 w-12 bg-emerald-400 rounded mb-6"></div>

                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            With over <span className="font-bold text-slate-900">8 years of experience in Digital Marketing</span>, Umesh Kumar leads Aiclex Technologies with a strong vision of innovation, performance, and scalable digital solutions.
                        </p>

                        <p className="text-slate-600 text-lg leading-relaxed">
                            His expertise in strategy, automation, and marketing has been the foundation of the company’s growth.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
