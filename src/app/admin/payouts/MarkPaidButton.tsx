'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { markPayoutPaid } from '../actions';
import toast from 'react-hot-toast';

export default function MarkPaidButton({ requestId }: { requestId: number }) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        if (!confirm("Confirm you have transferred the funds. Mark request as PAID?")) return;

        setLoading(true);
        const toastId = toast.loading("Processing ledger update...");

        try {
            await markPayoutPaid(requestId);
            toast.success("Payout marked as complete.", { id: toastId });
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleApprove}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            One-Click Pay
        </button>
    );
}
