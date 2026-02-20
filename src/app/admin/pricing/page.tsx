import { getPricingPlans } from '../actions';
import PricingEditorClient from './PricingEditorClient';

export default async function AdminPricingPage() {
    const plans = await getPricingPlans();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">₹</span>
                    Dynamic Pricing Configurator
                </h1>
                <p className="text-slate-400 mt-2">Adjust the platform's public pricing parameters, credit rewards, and marketing labels in real-time.</p>
            </div>

            <PricingEditorClient initialPlans={plans} />
        </div>
    );
}
