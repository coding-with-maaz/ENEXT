import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { PRODUCT_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, parseNumber, parseIntSafe } from '@/lib/utils';
import { generateSlug, generateUniqueSlug } from '@/lib/slug-utils';

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
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      sku,
      short_description,
      image_url,
      tags,
      meta_title,
      meta_description,
      isFeatured,
      isBestseller,
    } = body;

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
    const isFeaturedFlag = isFeatured === true || isFeatured === 'true' || isFeatured === 'yes' ? 1 : 0;
    const isBestsellerFlag = isBestseller === true || isBestseller === 'true' || isBestseller === 'yes' ? 1 : 0;

    if (parsedPrice <= 0) {
      return createErrorResponse('Price must be greater than 0', HTTP_STATUS.BAD_REQUEST);
    }

    // Try to generate slug and insert with slug
    let result, insertError;
    try {
      const baseSlug = generateSlug(name);
      const [existingSlugsData, slugsError]: any = await executeQuery(PRODUCT_QUERIES.SELECT_SLUGS);
      const existingSlugs = slugsError ? [] : existingSlugsData.map((row: any) => row.slug);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

      // Insert product with slug
      [result, insertError] = await executeQuery(
        PRODUCT_QUERIES.INSERT,
        [
          name,
          uniqueSlug,
          category || null,
          brand || null,
          sku || null,
          description || '',
          short_description || null,
          parsedPrice,
          parsedStock,
          isFeaturedFlag,
          isBestsellerFlag,
          image_url || null,
          tags || null,
          meta_title || null,
          meta_description || null,
        ]
      );
    } catch (slugError: any) {
      // If slug column doesn't exist, insert without slug (backward compatibility)
      if (slugError.code === 'ER_BAD_FIELD_ERROR') {
        [result, insertError] = await executeQuery(
          `INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)`,
          [name, description || '', parsedPrice, parsedStock]
        );
      } else {
        throw slugError;
      }
    }
    
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

