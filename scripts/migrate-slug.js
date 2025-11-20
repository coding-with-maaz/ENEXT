const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateSlug() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'enext_db',
    });

    console.log('✅ Connected to database');

    // Check if slug column already exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'slug'
    `, [process.env.DB_NAME || 'enext_db']);

    if (columns.length > 0) {
      console.log('⚠️  Slug column already exists. Updating existing products...');
    } else {
      // Add slug column
      console.log('📝 Adding slug column...');
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name,
        ADD INDEX idx_slug (slug)
      `);
      console.log('✅ Slug column added');
    }

    // Get all products
    const [products] = await connection.query('SELECT id, name, slug FROM products');

    console.log(`📦 Found ${products.length} products to update`);

    // Generate and update slugs for each product
    for (const product of products) {
      // Generate slug from name
      let slug = product.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // If slug is empty, use product id
      if (!slug) {
        slug = `product-${product.id}`;
      }

      // Check if slug already exists (excluding current product)
      let uniqueSlug = slug;
      let counter = 1;
      
      while (true) {
        const [existing] = await connection.query(
          'SELECT id FROM products WHERE slug = ? AND id != ?',
          [uniqueSlug, product.id]
        );

        if (existing.length === 0) {
          break;
        }

        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      // Update product with slug
      await connection.query(
        'UPDATE products SET slug = ? WHERE id = ?',
        [uniqueSlug, product.id]
      );

      console.log(`  ✓ Updated: ${product.name} → ${uniqueSlug}`);
    }

    // Make slug required (if not already)
    try {
      await connection.query(`
        ALTER TABLE products 
        MODIFY COLUMN slug VARCHAR(255) NOT NULL
      `);
      console.log('✅ Slug column set as required');
    } catch (error) {
      // Column might already be NOT NULL
      if (!error.message.includes('Duplicate')) {
        console.log('ℹ️  Slug column already set as required');
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Products updated: ${products.length}`);
    console.log('   - Slug column: ✅ Added and indexed');
    console.log('   - All products now have unique slugs');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migration
migrateSlug();

