const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'maaz',
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS enext_db');
    console.log('✅ Database created or already exists');

    // Use the database
    await connection.query('USE enext_db');
    console.log('✅ Using database: enext_db');

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
    console.log('✅ Users table created');

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
    console.log('✅ Products table created');

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
    console.log('✅ Orders table created');

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
    console.log('✅ Order items table created');

    // Insert sample users
    await connection.query(`
      INSERT IGNORE INTO users (name, email) VALUES
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com')
    `);
    console.log('✅ Sample users inserted');

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
    console.log('✅ Sample products inserted');

    console.log('\n🎉 Database initialized successfully!');
    console.log('You can now start your Next.js application with: npm run dev\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();

