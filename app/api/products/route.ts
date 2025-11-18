import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all products
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description || '', parseFloat(price), parseInt(stock) || 0]
    );

    const [newProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json(
      { success: true, data: newProduct[0] },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

