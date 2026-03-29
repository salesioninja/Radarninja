import { db } from './index';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log("Creating push_subscriptions table if it doesn't exist...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        endpoint VARCHAR(1024) NOT NULL,
        p256dh VARCHAR(255) NOT NULL,
        auth VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("Success!");
  } catch (err) {
    console.error("Error creating table:", err);
  }
  process.exit();
}
main();
