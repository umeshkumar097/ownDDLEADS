import dns from 'node:dns';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Force DNS to IPv4
dns.setDefaultResultOrder('ipv4first');

// Required for Node.js usage of Neon WebSocket tunneling
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 20 // Enforce max concurrent connections
});

export const db = drizzle(pool, { schema });
