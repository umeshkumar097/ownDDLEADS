import { db } from './src/db';
import { users } from './src/db/schema';

async function main() {
    const allUsers = await db.select({ email: users.email, role: users.role }).from(users);
    console.log("All User Emails:", JSON.stringify(allUsers, null, 2));
    process.exit(0);
}

main().catch(console.error);
