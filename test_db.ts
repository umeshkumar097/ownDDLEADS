import { db } from './src/db';
import { users } from './src/db/schema';

async function main() {
    const allUsers = await db.query.users.findMany();
    console.log(JSON.stringify(allUsers, null, 2));
    process.exit(0);
}

main().catch(console.error);
