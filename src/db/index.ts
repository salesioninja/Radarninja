import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in the environment variables. Ensure .env or .env.local is loaded, especially during build time.");
}

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection);
