'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface GeoData {
    city: string | null;
    region: string | null;
    country: string | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * A hook that determines the user's city intent.
 * 1. Highest Priority: `?city=` URL parameter (e.g. ?city=Noida)
 * 2. Fallback: IP-based Geolocation using ipapi.co
 */
export function useGeolocation(): GeoData {
    const searchParams = useSearchParams();
    const urlCity = searchParams.get('city');

    const [geo, setGeo] = useState<GeoData>({
        city: urlCity || null, // Immediately set URL city if present to avoid flicker
        region: null,
        country: null,
        isLoading: !urlCity, // If URL city isn't present, we load the IP fetcher
        error: null,
    });

    useEffect(() => {
        // If a city is explicitly requested via URL, we prioritize it and skip IP checks.
        if (urlCity) {
            // Capitalize the first letter for UI consistency: "noida" -> "Noida"
            const formattedCity = urlCity.charAt(0).toUpperCase() + urlCity.slice(1);
            setGeo(prev => ({ ...prev, city: formattedCity, isLoading: false }));
            return;
        }

        // Otherwise, attempt IP Geolocation fallback
        const fetchIPLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch IP data');

                const data = await response.json();

                setGeo({
                    city: data.city || 'your city',
                    region: data.region,
                    country: data.country_name,
                    isLoading: false,
                    error: null
                });
            } catch (err: any) {
                setGeo(prev => ({
                    ...prev,
                    isLoading: false,
                    error: err.message,
                    city: 'your city' // Generic fallback text
                }));
            }
        };

        fetchIPLocation();
    }, [urlCity]);

    return geo;
}
