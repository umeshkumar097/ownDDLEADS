import { db } from './src/db/index';
import { users } from './src/db/schema';
async function run() {
  const allUsers = await db.select().from(users).limit(5);
  console.log(allUsers);
  process.exit(0);
}
run();
