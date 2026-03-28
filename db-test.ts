import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';

async function main() {
  console.log("DB URL from process.env:", process.env.DATABASE_URL);
  try {
    const allUsers = await db.select().from(users).limit(1);
    console.log("Success! Found users.");
  } catch (err) {
    console.error("Database connection error:", err);
  }
  process.exit(0);
}
main();
