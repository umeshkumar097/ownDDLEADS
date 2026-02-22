declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        fbq?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    // Check if we are in the browser
    if (typeof window === 'undefined') return;

    // 1. Fire Google Analytics / Google Ads Event
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventParams);
    }

    // 2. Fire Meta Pixel Event
    // Meta uses specific standard events or 'trackCustom' for custom ones
    if (typeof window.fbq === 'function') {
        const standardMetaEvents = ['Purchase', 'Lead', 'CompleteRegistration', 'AddPaymentInfo', 'AddToCart', 'InitiateCheckout'];

        let metaEventName = eventName;
        // Map our custom events to Meta Standard events if possible for better optimization
        if (eventName === 'Registration_Complete') metaEventName = 'CompleteRegistration';
        if (eventName === 'Payment_Initiated') metaEventName = 'InitiateCheckout';
        if (eventName === 'Purchase_Success') metaEventName = 'Purchase';

        if (standardMetaEvents.includes(metaEventName)) {
            window.fbq('track', metaEventName, eventParams);
        } else {
            window.fbq('trackCustom', eventName, eventParams);
        }
    }

    // 3. Optional: Push to DataLater for GTM
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...eventParams
        });
    }
};
