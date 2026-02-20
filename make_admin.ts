import { config } from 'dotenv';
config();
import { db } from './src/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const user = await db.query.users.findFirst({
        where: eq(users.email, "info@aiclex.in")
    });
    console.log("Before User:", user);
    
    if (user && user.role !== 'admin') {
        await db.update(users).set({ role: 'admin' }).where(eq(users.email, "info@aiclex.in"));
        console.log("Updated user to admin.");
    } else if (!user) {
        console.log("User not found!");
    } else {
        console.log("User is already admin!");
    }
    process.exit(0);
}

main().catch(console.error);
