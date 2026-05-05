import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import dns from 'dns';

// Force IPv4 DNS resolution — fixes ETIMEDOUT on VPS servers with broken IPv6
dns.setDefaultResultOrder('ipv4first');

// Standard pg Pool — works with Neon (pgbouncer/pooler URL) and Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
    max: 10, // Increased for concurrent queries on wallet page
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 20000, // Increased timeout to 20s
});

export const db = drizzle(pool, { schema });
