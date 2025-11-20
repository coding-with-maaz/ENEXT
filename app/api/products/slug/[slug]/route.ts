import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { PRODUCT_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';

// GET product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const [rows, error]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_SLUG, [params.slug]);

    // If slug column doesn't exist, try to fetch by ID as fallback
    if (error && error.code === 'ER_BAD_FIELD_ERROR') {
      // Slug column doesn't exist yet - try ID fallback
      const id = parseInt(params.slug);
      if (!isNaN(id)) {
        const [idRows, idError]: any = await executeQuery(PRODUCT_QUERIES.SELECT_BY_ID, [id]);
        if (!idError && idRows.length > 0) {
          return createSuccessResponse(idRows[0]);
        }
      }
      return createErrorResponse('Slug column not found. Please run the database migration.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

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

