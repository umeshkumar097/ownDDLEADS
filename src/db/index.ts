import dns from 'node:dns';
import https from 'node:https';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Force DNS to prefer IPv4 (fixes VPS servers with broken IPv6)
dns.setDefaultResultOrder('ipv4first');

// Custom fetch that forces IPv4 via Node's native https.request (family: 4)
// Must return a fetch-compatible object with .text() and .json() as Promises
function ipv4Fetch(urlInput: string | URL | Request, opts: RequestInit = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const url = typeof urlInput === 'string' ? urlInput
            : urlInput instanceof URL ? urlInput.toString()
            : (urlInput as Request).url;
        const parsed = new URL(url);
        const body = opts.body ? opts.body.toString() : undefined;
        const headers: Record<string, string> = Object.assign({}, opts.headers as Record<string, string> || {});
        if (body) headers['Content-Length'] = String(Buffer.byteLength(body));
        const req = https.request({
            hostname: parsed.hostname,
            port: 443,
            path: parsed.pathname + parsed.search,
            method: (opts.method || 'GET').toUpperCase(),
            headers,
            family: 4, // Force IPv4 only
        } as https.RequestOptions, (res) => {
            const chunks: Buffer[] = [];
            res.on('data', (c: Buffer) => chunks.push(c));
            res.on('end', () => {
                const text = Buffer.concat(chunks).toString();
                const ok = (res.statusCode ?? 200) >= 200 && (res.statusCode ?? 200) < 300;
                resolve({
                    ok,
                    status: res.statusCode ?? 200,
                    headers: res.headers,
                    text: () => Promise.resolve(text),
                    json: () => Promise.resolve(JSON.parse(text)),
                } as unknown as Response);
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

// Set GLOBALLY before creating neon client — this is critical
neonConfig.fetchFunction = ipv4Fetch;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

