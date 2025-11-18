import mysql from 'mysql2/promise';

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'maaz',
  database: process.env.DB_NAME || 'enext_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
}

export default pool;

