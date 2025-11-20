-- Migration: Add slug column to products table
-- Run this migration to add slug support to products

ALTER TABLE products 
ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name,
ADD INDEX idx_slug (slug);

-- Generate slugs for existing products
UPDATE products 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '(', ''), ')', ''), '''', ''))
WHERE slug IS NULL OR slug = '';

-- Make slug required (after generating for existing products)
ALTER TABLE products 
MODIFY COLUMN slug VARCHAR(255) NOT NULL;

