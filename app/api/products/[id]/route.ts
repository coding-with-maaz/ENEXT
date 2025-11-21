import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { PRODUCT_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, parseNumber, parseIntSafe } from '@/lib/utils';
import { generateSlug, generateUniqueSlug } from '@/lib/slug-utils';

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows, error]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_ID, [params.id]);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    if (rows.length === 0) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.PRODUCT, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(rows[0]);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Try to update with slug, fallback to without slug if column doesn't exist
    let updateError;
    try {
      const [currentProduct]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_ID, [params.id]);
      let slug = currentProduct[0]?.slug;
      
      // Regenerate slug if name changed
      if (currentProduct[0]?.name !== name) {
        const baseSlug = generateSlug(name);
        const [existingSlugsData, slugsError]: any = await executeQuery(PRODUCT_QUERIES.SELECT_SLUGS);
        const existingSlugs = slugsError ? [] : existingSlugsData
          .map((row: any) => row.slug)
          .filter((s: string) => s !== slug); // Exclude current product's slug
        slug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      // Update product with slug
      [, updateError] = await executeQuery(
        PRODUCT_QUERIES.UPDATE,
        [
          name,
          slug,
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
          params.id,
        ]
      );
    } catch (slugError: any) {
      // If slug column doesn't exist, update without slug (backward compatibility)
      if (slugError.code === 'ER_BAD_FIELD_ERROR') {
        [, updateError] = await executeQuery(
          `UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?`,
          [name, description || '', parsedPrice, parsedStock, params.id]
        );
      } else {
        throw slugError;
      }
    }
    
    if (updateError) {
      return createErrorResponse(updateError.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Fetch updated product
    const [updatedProduct, fetchError]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_ID, [params.id]);
    
    if (fetchError || !updatedProduct[0]) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.PRODUCT, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(updatedProduct[0], HTTP_STATUS.OK, API_MESSAGES.PRODUCT_UPDATED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result, error]: any = await executeQuery(PRODUCT_QUERIES.DELETE, [params.id]);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    if (result.affectedRows === 0) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.PRODUCT, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(null, HTTP_STATUS.OK, API_MESSAGES.PRODUCT_DELETED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

