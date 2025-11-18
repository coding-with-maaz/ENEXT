import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, params.id]
    );

    const [updatedUser]: any = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({ success: true, data: updatedUser[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result]: any = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

