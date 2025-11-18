import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { USER_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, isValidEmail } from '@/lib/utils';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows, error]: any = await executeQuery(USER_QUERIES.SELECT_BY_ID, [params.id]);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    if (rows.length === 0) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.USER, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(rows[0]);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

    // Validate required fields
    const validation = validateRequired(body, ['name', 'email']);
    if (!validation.isValid) {
      return createErrorResponse(
        `${API_MESSAGES.VALIDATION_ERROR.NAME_REQUIRED} and ${API_MESSAGES.VALIDATION_ERROR.EMAIL_REQUIRED}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return createErrorResponse(
        API_MESSAGES.VALIDATION_ERROR.INVALID_EMAIL,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Update user
    const [, updateError] = await executeQuery(USER_QUERIES.UPDATE, [name, email, params.id]);
    
    if (updateError) {
      return createErrorResponse(updateError.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Fetch updated user
    const [updatedUser, fetchError]: any = await executeQuery(USER_QUERIES.SELECT_BY_ID, [params.id]);
    
    if (fetchError || !updatedUser[0]) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.USER, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(updatedUser[0], HTTP_STATUS.OK, API_MESSAGES.USER_UPDATED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result, error]: any = await executeQuery(USER_QUERIES.DELETE, [params.id]);

    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    if (result.affectedRows === 0) {
      return createErrorResponse(API_MESSAGES.NOT_FOUND.USER, HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse(null, HTTP_STATUS.OK, API_MESSAGES.USER_DELETED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

