import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { DB_DEFAULTS } from '@/lib/constants';
import { HTTP_STATUS } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';

export async function POST() {
  let connection;
  
  try {
    // Create connection without specifying database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || DB_DEFAULTS.HOST,
      user: process.env.DB_USER || DB_DEFAULTS.USER,
      password: process.env.DB_PASSWORD || DB_DEFAULTS.PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS enext_db');
    
    // Use the database
    await connection.query('USE enext_db');

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create Order Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Insert sample users
    await connection.query(`
      INSERT IGNORE INTO users (name, email) VALUES
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com')
    `);

    // Insert sample products
    await connection.query(`
      INSERT IGNORE INTO products (name, description, price, stock) VALUES
        ('Laptop', 'High-performance laptop with latest processor', 999.99, 10),
        ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 29.99, 50),
        ('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 79.99, 30),
        ('Monitor', '27-inch 4K UHD monitor with HDR support', 349.99, 15),
        ('Webcam', '1080p HD webcam with auto-focus', 89.99, 25),
        ('Headphones', 'Wireless noise-cancelling headphones', 199.99, 20)
    `);

    return createSuccessResponse(
      { message: 'Database initialized successfully with sample data' },
      HTTP_STATUS.OK
    );
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return createErrorResponse(
      error.message || 'Failed to initialize database',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

