# Slug Migration Guide for ENEXT

This guide explains the slug-based URL implementation for better SEO.

## 📋 Overview

Products now use SEO-friendly slugs in URLs instead of numeric IDs:
- **Before**: `/product/123`
- **After**: `/product/laptop-high-performance`

## 🗄️ Database Migration

### Step 1: Run the Migration

Execute the SQL migration to add the `slug` column:

```sql
-- Run this in your MySQL database
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

Or use the migration file:
```bash
mysql -u root -p enext_db < lib/migrations/add-slug-to-products.sql
```

## 🔧 Implementation Details

### 1. Slug Generation

Slugs are automatically generated from product names:
- Converted to lowercase
- Special characters removed
- Spaces replaced with hyphens
- Unique slugs generated if duplicates exist

**Example:**
- Product Name: "High-Performance Laptop (2024)"
- Generated Slug: "high-performance-laptop-2024"

### 2. API Routes

#### New Route: `/api/products/slug/[slug]`
- Fetches products by slug
- Used for product detail pages

#### Updated Routes:
- `POST /api/products` - Automatically generates slug
- `PUT /api/products/[id]` - Updates slug if name changes

### 3. Product URLs

Use the `getProductUrl()` utility function:

```typescript
import { getProductUrl } from '@/lib/product-url';

const url = getProductUrl({ id: 1, slug: 'laptop' });
// Returns: '/product/laptop'
```

### 4. Backward Compatibility

The system supports both slug and ID-based URLs:
- Slug URLs are preferred: `/product/laptop`
- ID URLs still work: `/product/1` (fallback)

## 📁 Updated Files

### Core Files
- `lib/slug-utils.ts` - Slug generation utilities
- `lib/product-url.ts` - Product URL helper
- `lib/queries.ts` - Updated SQL queries
- `lib/migrations/add-slug-to-products.sql` - Database migration

### API Routes
- `app/api/products/route.ts` - Generates slugs on create
- `app/api/products/[id]/route.ts` - Updates slugs on edit
- `app/api/products/slug/[slug]/route.ts` - Fetch by slug

### Components
- `components/AnimatedProductCard.tsx` - Uses `getProductUrl()`
- `app/product/[id]/page.tsx` - Fetches by slug with ID fallback
- `app/product/[id]/layout.tsx` - Metadata uses slugs

### SEO
- `app/sitemap.ts` - Uses slugs in sitemap
- `components/SEO/BreadcrumbSchema.tsx` - Breadcrumb structured data
- `components/SEO/FAQSchema.tsx` - FAQ structured data
- `components/SEO/ReviewSchema.tsx` - Review structured data

## 🎯 SEO Enhancements

### 1. Structured Data Added

#### Breadcrumb Schema
- Shows navigation path in search results
- Improves user experience

#### FAQ Schema
- Displays FAQs in search results
- Rich snippets in Google

#### Review Schema
- Shows product ratings in search
- Aggregate rating display

### 2. URL Structure

**Before:**
```
/product/123
```

**After:**
```
/product/laptop-high-performance
```

### 3. Metadata Updates

- Canonical URLs use slugs
- Open Graph URLs use slugs
- Sitemap uses slugs

## 🔄 Migration Steps

1. **Backup Database**
   ```bash
   mysqldump -u root -p enext_db > backup.sql
   ```

2. **Run Migration**
   ```bash
   mysql -u root -p enext_db < lib/migrations/add-slug-to-products.sql
   ```

3. **Verify Slugs**
   ```sql
   SELECT id, name, slug FROM products;
   ```

4. **Test URLs**
   - Visit product pages using slugs
   - Verify old ID URLs still work (backward compatibility)

## 📝 Admin Panel

When creating/editing products:
- Slugs are automatically generated
- No manual input required
- Unique slugs ensured automatically

## 🚀 Benefits

1. **Better SEO**
   - Keyword-rich URLs
   - Improved search rankings
   - Better click-through rates

2. **User Experience**
   - Readable URLs
   - Shareable links
   - Professional appearance

3. **Search Engine Optimization**
   - Rich snippets with structured data
   - Breadcrumbs in search results
   - FAQ and review visibility

## ⚠️ Important Notes

1. **Existing Products**: Run migration to generate slugs
2. **New Products**: Slugs generated automatically
3. **URL Changes**: Old ID URLs still work (backward compatible)
4. **Sitemap**: Automatically uses slugs

## 🧪 Testing

1. Create a new product - verify slug is generated
2. Edit product name - verify slug updates
3. Visit `/product/[slug]` - should load correctly
4. Visit `/product/[id]` - should still work (fallback)
5. Check sitemap.xml - should use slugs

## 📊 Monitoring

After migration, monitor:
- 404 errors (should be minimal due to fallback)
- Search engine indexing
- URL structure in search results
- Structured data validation

---

**Note**: The route folder is still named `[id]` for backward compatibility, but it now accepts both slugs and IDs.

