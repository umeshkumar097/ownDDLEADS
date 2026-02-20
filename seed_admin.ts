import { db } from './src/db';
import { users } from './src/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
    const hashedPassword = await bcrypt.hash("Umesh@2003##", 10);
    console.log("Hashing done. Inserting...");
    try {
        await db.insert(users).values({
            name: "Umesh Admin",
            email: "info@aiclex.in",
            password: hashedPassword,
            role: "admin",
            phone: "+910000000000"
        });
        console.log("Admin info@aiclex.in seeded successfully.");
    } catch(e) {
        console.error("Error inserting:", e);
    }
    process.exit(0);
}

main().catch(console.error);
