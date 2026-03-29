const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function main() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [offers] = await connection.execute('SELECT title, image_url FROM offers LIMIT 5');
    console.log("Updated Offers Sample:", offers);
    const [biz] = await connection.execute('SELECT name FROM businesses LIMIT 5');
    console.log("Updated Businesses Sample:", biz);
    await connection.end();
  } catch (err) {
    console.error("Failed to connect:", err.message);
  }
}

main();
