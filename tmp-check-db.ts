import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  const [offers] = await connection.execute('SELECT id, title, description, imageUrl, business_id FROM offers');
  console.log("Offers:", offers);
  
  const [businesses] = await connection.execute('SELECT id, name, category, long_description FROM businesses');
  console.log("Businesses:", businesses);

  await connection.end();
}

main().catch(console.error);
