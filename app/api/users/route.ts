import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all users
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    const [newUser] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json(
      { success: true, data: newUser[0] },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

