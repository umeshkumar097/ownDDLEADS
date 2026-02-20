import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { targetJobRole, targetLocation, pageToken } = await req.json();

        if (!targetJobRole || !targetLocation || targetJobRole.length < 3 || targetLocation.length < 3) {
            return NextResponse.json({ error: 'Please enter valid, descriptive keywords (min 3 characters).' }, { status: 400 });
        }

        // Phase 4: Google Places API - Real Data Extraction (Using Places API New)
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey || apiKey === 'dummy') {
            return NextResponse.json({ error: 'Google Places API key is missing or invalid in server config.' }, { status: 500 });
        }

        // Query example: "Real estate in Noida"
        const query = `${targetJobRole} in ${targetLocation}`;
        const googleUrl = `https://places.googleapis.com/v1/places:searchText`;

        const requestBody: any = {
            textQuery: query,
        };
        if (pageToken) {
            requestBody.pageToken = pageToken;
        }

        const gRes = await fetch(googleUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.rating,places.internationalPhoneNumber,places.websiteUri,nextPageToken'
            },
            body: JSON.stringify(requestBody)
        });

        const gData = await gRes.json();

        if (gData.error) {
            console.error('Google API Error:', gData.error);
            return NextResponse.json({ error: 'Failed to fetch real data from Google Maps API.' }, { status: 500 });
        }

        const places = gData.places || [];
        const bulkLeads = [];

        // Map up to 25 results to our UI structure
        for (let i = 0; i < Math.min(places.length, 25); i++) {
            const place = places[i];

            // Format fallback name based on business name
            const businessName = place.displayName?.text || 'Unknown Business';
            const address = place.formattedAddress || targetLocation;
            const exactPhone = place.internationalPhoneNumber || '';
            const website = place.websiteUri || '';

            // Map the B2B Company name directly so it doesn't look like a fake person's name
            const displayTitle = businessName;
            const companyDomainFallback = businessName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

            bulkLeads.push({
                id: `google_${place.id}_${i}`,
                name: displayTitle,
                role: targetJobRole, // Keeping the searched intent
                company: businessName,
                location: address,
                emailMasked: `contact***@${companyDomainFallback}`,
                phoneMasked: exactPhone ? `${exactPhone.substring(0, 6)} ******${Math.floor(Math.random() * 90) + 10}` : `+91 ******${Math.floor(Math.random() * 90) + 10}`, // Masked for UI tease
                linkedinMasked: `linkedin.com/company/${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}***`,

                // Keep the real place id to query exact details during "Unlock"
                _rawPayload: {
                    place_id: place.id,
                    name: displayTitle,
                    role: targetJobRole,
                    company: businessName,
                    location: address,
                    // Pass the real phone and website directly in the payload so we don't need a second API call later
                    email: `sales@${companyDomainFallback}`,
                    phone: exactPhone || '',
                    linkedin: website || `https://linkedin.com/company/${businessName}`,
                    bio: `Extracted from Google Places API. Verified Business Location: ${address}. Rating: ${place.rating || 'N/A'}`
                }
            });
        }

        return NextResponse.json({ success: true, count: bulkLeads.length, results: bulkLeads, nextPageToken: gData.nextPageToken });

    } catch (error: any) {
        console.error("Bulk Search Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
