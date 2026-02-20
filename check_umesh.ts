import { db } from './src/db';
import { users } from './src/db/schema';
import { ilike } from 'drizzle-orm';

async function main() {
    const umeshUsers = await db.query.users.findMany();
    console.log("All Users:", JSON.stringify(umeshUsers, null, 2));
    process.exit(0);
}

main().catch(console.error);
