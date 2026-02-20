import { db } from './src/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const user = await db.query.users.findFirst({
        where: eq(users.email, "info@aiclex.in")
    });
    console.log("User:", user);
    process.exit(0);
}

main().catch(console.error);
