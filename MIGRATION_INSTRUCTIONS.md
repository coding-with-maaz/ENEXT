# Database Migration Instructions

## Quick Fix for Slug Column Error

If you're seeing the error: `Unknown column 'slug' in 'where clause'`, you need to run the database migration.

## Option 1: Run SQL Migration (Recommended)

### Using MySQL Command Line:

```bash
mysql -u root -p enext_db < lib/migrations/add-slug-to-products.sql
```

### Or manually in MySQL:

```sql
USE enext_db;

-- Add slug column
ALTER TABLE products 
ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name,
ADD INDEX idx_slug (slug);

-- Generate slugs for existing products
UPDATE products 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '(', ''), ')', ''), '''', ''))
WHERE slug IS NULL OR slug = '';

-- Make slug required
ALTER TABLE products 
MODIFY COLUMN slug VARCHAR(255) NOT NULL;
```

## Option 2: Use Migration Script

Create a file `run-migration.js`:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'enext_db',
  });

  try {
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'lib/migrations/add-slug-to-products.sql'),
      'utf8'
    );
    
    await connection.query(migrationSQL);
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
```

Run it:
```bash
node run-migration.js
```

## Verification

After running the migration, verify it worked:

```sql
SELECT id, name, slug FROM products;
```

You should see slugs for all products.

## Temporary Workaround

The code now handles the missing slug column gracefully:
- Product creation will work without slug column (uses old format)
- Product updates will work without slug column
- Slug-based URLs will fallback to ID-based URLs

However, **you should still run the migration** to get full SEO benefits.

## After Migration

Once the migration is complete:
1. All new products will automatically get slugs
2. Product URLs will use slugs: `/product/laptop` instead of `/product/1`
3. Better SEO with keyword-rich URLs
4. All SEO features will work properly

---

**Note**: The application will continue to work without the slug column, but you'll miss out on SEO benefits. Run the migration when convenient!

