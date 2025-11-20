import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ORDER_QUERIES, ORDER_ITEM_QUERIES, PRODUCT_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES, ORDER_STATUS } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, parseNumber, parseIntSafe } from '@/lib/utils';

// GET all orders with user and items
export async function GET() {
  try {
    const [orders, error]: any = await executeQuery(ORDER_QUERIES.SELECT_ALL);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Get order items for each order asynchronously
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const [items, itemsError]: any = await executeQuery(
          ORDER_ITEM_QUERIES.SELECT_BY_ORDER_ID,
          [order.id]
        );
        
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          return { ...order, items: [] };
        }
        
        return { ...order, items };
      })
    );

    return createSuccessResponse(ordersWithItems);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch orders', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      items, 
      customer_info, 
      shipping_info, 
      billing_info, 
      shipping_method 
    } = body;

    // Validate required fields
    if (!user_id) {
      return createErrorResponse(API_MESSAGES.VALIDATION_ERROR.USER_ID_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return createErrorResponse(API_MESSAGES.VALIDATION_ERROR.ITEMS_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    // Calculate total and validate products asynchronously
    let total = 0;
    const productValidations = await Promise.all(
      items.map(async (item: any) => {
        const [product, productError]: any = await executeQuery(
          PRODUCT_QUERIES.SELECT_PRICE,
          [item.product_id]
        );
        
        if (productError || product.length === 0) {
          return { error: `Product ${item.product_id} not found` };
        }
        
        const price = parseNumber(product[0].price);
        const quantity = parseIntSafe(item.quantity, 1);
        total += price * quantity;
        
        return { product_id: item.product_id, price, quantity };
      })
    );

    // Check for validation errors
    const validationError = productValidations.find((v: any) => v.error);
    if (validationError && validationError.error) {
      return createErrorResponse(validationError.error, HTTP_STATUS.BAD_REQUEST);
    }

    // Create order
    const [orderResult, orderError]: any = await executeQuery(
      ORDER_QUERIES.INSERT,
      [user_id, total, ORDER_STATUS.PENDING]
    );

    if (orderError) {
      return createErrorResponse(orderError.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const orderId = (orderResult as any).insertId;

    // Create order items asynchronously
    await Promise.all(
      productValidations.map(async (validation: any, index: number) => {
        const item = items[index];
        await executeQuery(
          ORDER_ITEM_QUERIES.INSERT,
          [orderId, item.product_id, validation.quantity, validation.price]
        );
      })
    );

    // Get complete order with items
    const [newOrder, fetchError]: any = await executeQuery(ORDER_QUERIES.SELECT_BY_ID, [orderId]);
    
    if (fetchError || !newOrder[0]) {
      return createErrorResponse('Failed to fetch created order', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const [orderItems, itemsFetchError]: any = await executeQuery(
      ORDER_ITEM_QUERIES.SELECT_BY_ORDER_ID,
      [orderId]
    );

    if (itemsFetchError) {
      console.error('Error fetching order items:', itemsFetchError);
    }

    newOrder[0].items = orderItems || [];

    return createSuccessResponse(newOrder[0], HTTP_STATUS.CREATED, API_MESSAGES.ORDER_CREATED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create order', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

