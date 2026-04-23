import dns from 'node:dns';
import https from 'node:https';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Force DNS to prefer IPv4 (fixes VPS servers with broken IPv6)
dns.setDefaultResultOrder('ipv4first');

// Custom fetch that forces IPv4 (family: 4) to fix "fetch failed" on IPv6-only servers
function ipv4Fetch(url: string, opts: RequestInit = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const body = opts.body ? opts.body.toString() : undefined;
        const reqOpts: https.RequestOptions = {
            hostname: parsed.hostname,
            port: parsed.port || 443,
            path: parsed.pathname + parsed.search,
            method: (opts.method || 'GET').toUpperCase(),
            headers: opts.headers as Record<string, string>,
            family: 4, // Force IPv4
        };
        const req = https.request(reqOpts, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                resolve(new Response(data, {
                    status: res.statusCode || 200,
                    headers: res.headers as HeadersInit,
                }));
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

// Inject IPv4 fetch + WebSocket for Neon on Node.js
neonConfig.fetchFunction = ipv4Fetch as any;
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 20,
});

export const db = drizzle(pool, { schema });
