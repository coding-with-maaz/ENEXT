import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { PRODUCT_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, parseNumber, parseIntSafe } from '@/lib/utils';

// GET all products
export async function GET() {
  try {
    const [rows, error] = await executeQuery(PRODUCT_QUERIES.SELECT_ALL);
    
    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return createSuccessResponse(rows);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch products', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock } = body;

    // Validate required fields
    const validation = validateRequired(body, ['name', 'price']);
    if (!validation.isValid) {
      return createErrorResponse(
        `${API_MESSAGES.VALIDATION_ERROR.NAME_REQUIRED} and ${API_MESSAGES.VALIDATION_ERROR.PRICE_REQUIRED}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Parse and validate numeric values
    const parsedPrice = parseNumber(price);
    const parsedStock = parseIntSafe(stock, 0);

    if (parsedPrice <= 0) {
      return createErrorResponse('Price must be greater than 0', HTTP_STATUS.BAD_REQUEST);
    }

    // Insert product
    const [result, insertError]: any = await executeQuery(
      PRODUCT_QUERIES.INSERT,
      [name, description || '', parsedPrice, parsedStock]
    );
    
    if (insertError) {
      return createErrorResponse(insertError.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Fetch created product
    const insertId = (result as any).insertId;
    const [newProduct, fetchError]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_ID, [insertId]);
    
    if (fetchError || !newProduct[0]) {
      return createErrorResponse('Failed to fetch created product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return createSuccessResponse(newProduct[0], HTTP_STATUS.CREATED, API_MESSAGES.PRODUCT_CREATED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

