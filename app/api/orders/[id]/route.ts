import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ORDER_QUERIES, ORDER_ITEM_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';

// GET order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [orders, error]: any = await executeQuery(ORDER_QUERIES.SELECT_BY_ID, [params.id]);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    if (orders.length === 0) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.ORDER, HTTP_STATUS.NOT_FOUND);
    }

    const order = orders[0];

    // Get order items
    const [items, itemsError]: any = await executeQuery(
      ORDER_ITEM_QUERIES.SELECT_BY_ORDER_ID,
      [params.id]
    );

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    order.items = items || [];

    return createSuccessResponse(order);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch order', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

