import { NextResponse } from 'next/server';
import { stripe } from '@/lib/auth';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const referralCode = cookieStore.get('ref')?.value || '';
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { creditAmount = 100, priceInCents = 2000, name = "100 Lead Credits Pack" } = await req.json().catch(() => ({}));

        const line_items = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: name,
                    description: `One-time addition of ${creditAmount} Premium Credits to your wallet`,
                },
                unit_amount: priceInCents,
            },
            quantity: 1,
        }];

        const stripeSession = await stripe.checkout.sessions.create({
            customer_email: session.user.email || undefined,
            payment_method_types: ['card'],
            line_items: line_items,
            metadata: {
                userId: session.user.id,
                creditsAmount: creditAmount.toString(),
                referralCode: referralCode,
            },
            mode: 'payment',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/wallet?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/wallet?canceled=true`,
        } as any);

        return NextResponse.json({ url: stripeSession.url });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
