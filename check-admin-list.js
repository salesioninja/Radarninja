const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  const [bCount] = await connection.execute('SELECT COUNT(*) as count FROM businesses');
  const [oCount] = await connection.execute('SELECT COUNT(*) as count FROM offers');
  
  console.log('Total Businesses:', bCount[0].count);
  console.log('Total Offers:', oCount[0].count);
  
  const [joined] = await connection.execute(`
    SELECT businesses.name as biz, offers.title as offer 
    FROM businesses 
    LEFT JOIN offers ON businesses.id = offers.business_id
  `);
  
  console.log('\nJoined Records (Business -> Offer):');
  joined.forEach(row => {
    console.log(`- ${row.biz} -> ${row.offer || 'MISSING OFFER'}`);
  });

  await connection.end();
}

main().catch(console.error);
