import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all orders with user and items
export async function GET() {
  try {
    const [orders]: any = await pool.execute(`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    // Get order items for each order
    for (const order of orders) {
      const [items]: any = await pool.execute(`
        SELECT 
          oi.*,
          p.name as product_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, items } = body;

    if (!user_id || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User ID and items are required' },
        { status: 400 }
      );
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const [product]: any = await pool.execute(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );
      if (product.length === 0) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product_id} not found` },
          { status: 400 }
        );
      }
      total += parseFloat(product[0].price) * parseInt(item.quantity);
    }

    // Create order
    const [orderResult]: any = await pool.execute(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [user_id, total, 'pending']
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      const [product]: any = await pool.execute(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );
      await pool.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, product[0].price]
      );
    }

    // Get complete order with items
    const [newOrder]: any = await pool.execute(`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    const [orderItems]: any = await pool.execute(`
      SELECT 
        oi.*,
        p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    newOrder[0].items = orderItems;

    return NextResponse.json(
      { success: true, data: newOrder[0] },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

