import { TABLES, ORDER_STATUS } from './constants';

// User Queries
export const USER_QUERIES = {
  SELECT_ALL: `SELECT * FROM ${TABLES.USERS} ORDER BY created_at DESC`,
  SELECT_BY_ID: `SELECT * FROM ${TABLES.USERS} WHERE id = ?`,
  INSERT: `INSERT INTO ${TABLES.USERS} (name, email) VALUES (?, ?)`,
  UPDATE: `UPDATE ${TABLES.USERS} SET name = ?, email = ? WHERE id = ?`,
  DELETE: `DELETE FROM ${TABLES.USERS} WHERE id = ?`,
} as const;

// Product Queries
export const PRODUCT_QUERIES = {
  SELECT_ALL: `SELECT * FROM ${TABLES.PRODUCTS} ORDER BY created_at DESC`,
  SELECT_BY_ID: `SELECT * FROM ${TABLES.PRODUCTS} WHERE id = ?`,
  SELECT_BY_SLUG: `SELECT * FROM ${TABLES.PRODUCTS} WHERE slug = ?`,
  SELECT_PRICE: `SELECT price FROM ${TABLES.PRODUCTS} WHERE id = ?`,
  SELECT_SLUGS: `SELECT slug FROM ${TABLES.PRODUCTS}`,
  INSERT: `
    INSERT INTO ${TABLES.PRODUCTS} 
      (name, slug, category, brand, sku, description, short_description, price, stock, is_featured, is_bestseller, image_url, tags, meta_title, meta_description) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  UPDATE: `
    UPDATE ${TABLES.PRODUCTS} 
    SET 
      name = ?, 
      slug = ?, 
      category = ?, 
      brand = ?, 
      sku = ?, 
      description = ?, 
      short_description = ?, 
      price = ?, 
      stock = ?, 
      is_featured = ?, 
      is_bestseller = ?, 
      image_url = ?, 
      tags = ?, 
      meta_title = ?, 
      meta_description = ?
    WHERE id = ?
  `,
  DELETE: `DELETE FROM ${TABLES.PRODUCTS} WHERE id = ?`,
} as const;

// Order Queries
export const ORDER_QUERIES = {
  SELECT_ALL: `
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM ${TABLES.ORDERS} o
    LEFT JOIN ${TABLES.USERS} u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `,
  SELECT_BY_ID: `
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM ${TABLES.ORDERS} o
    LEFT JOIN ${TABLES.USERS} u ON o.user_id = u.id
    WHERE o.id = ?
  `,
  INSERT: `INSERT INTO ${TABLES.ORDERS} (user_id, total, status) VALUES (?, ?, ?)`,
} as const;

// Order Item Queries
export const ORDER_ITEM_QUERIES = {
  SELECT_BY_ORDER_ID: `
    SELECT 
      oi.*,
      p.name as product_name
    FROM ${TABLES.ORDER_ITEMS} oi
    LEFT JOIN ${TABLES.PRODUCTS} p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `,
  INSERT: `INSERT INTO ${TABLES.ORDER_ITEMS} (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
} as const;

