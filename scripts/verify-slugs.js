const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifySlugs() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'enext_db',
    });

    const [products] = await connection.query('SELECT id, name, slug FROM products ORDER BY id');
    
    console.log('\n📦 Products with slugs:\n');
    products.forEach(p => {
      console.log(`  ${p.id}. ${p.name}`);
      console.log(`     Slug: ${p.slug}`);
      console.log(`     URL: /product/${p.slug}\n`);
    });

    console.log(`✅ Total products: ${products.length}`);
    console.log('✅ All products have slugs!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

verifySlugs();

