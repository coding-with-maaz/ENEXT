import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { DB_DEFAULTS } from './constants';

// Database configuration interface
interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

// Create database configuration
const dbConfig: DbConfig = {
  host: process.env.DB_HOST || DB_DEFAULTS.HOST,
  user: process.env.DB_USER || DB_DEFAULTS.USER,
  password: process.env.DB_PASSWORD || DB_DEFAULTS.PASSWORD,
  database: process.env.DB_NAME || DB_DEFAULTS.DATABASE,
  waitForConnections: true,
  connectionLimit: DB_DEFAULTS.CONNECTION_LIMIT,
  queueLimit: DB_DEFAULTS.QUEUE_LIMIT,
};

// Create a connection pool for better performance
const pool: Pool = mysql.createPool(dbConfig);

// Test the connection asynchronously
export async function testConnection(): Promise<boolean> {
  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ MySQL database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Execute query with proper error handling
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<[T[], any]> {
  try {
    const [rows] = await pool.execute(query, params);
    return [rows as T[], null];
  } catch (error: any) {
    console.error('Database query error:', error);
    return [[], error];
  }
}

// Get a connection from the pool
export async function getConnection(): Promise<PoolConnection> {
  return await pool.getConnection();
}

// Close all connections (useful for graceful shutdown)
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;

