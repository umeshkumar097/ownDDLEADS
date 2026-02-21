import { JWT } from 'google-auth-library';

export async function requestGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        console.warn('Google Indexing API bypassed: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in environment variables.');
        return false;
    }

    try {
        const client = new JWT({
            email: clientEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const tokenResponse = await client.authorize();
        const accessToken = tokenResponse.access_token;

        if (!accessToken) throw new Error('Failed to obtain Google Indexing access token');

        const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                url,
                type,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Google Indexing API Error:', data);
            return false;
        }

        console.log(`Successfully pinged Google Indexing API for ${url}`);
        return true;
    } catch (e) {
        console.error('Exception in requestGoogleIndexing:', e);
        return false;
    }
}
