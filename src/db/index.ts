import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Standard PostgreSQL connection — works with Supabase, Railway, any standard PG host
const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false }, // Required for Supabase SSL
    max: 10,
});

export const db = drizzle(pool, { schema });

