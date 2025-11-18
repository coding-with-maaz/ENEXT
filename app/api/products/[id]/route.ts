import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
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

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, stock } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    await pool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description || '', parseFloat(price), parseInt(stock) || 0, params.id]
    );

    const [updatedProduct]: any = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({ success: true, data: updatedProduct[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result]: any = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

