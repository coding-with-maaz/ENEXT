import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';
import { USER_QUERIES } from '@/lib/queries';
import { HTTP_STATUS, API_MESSAGES } from '@/lib/constants';
import { createSuccessResponse, createErrorResponse, validateRequired, isValidEmail } from '@/lib/utils';

// GET all users
export async function GET() {
  try {
    const [rows, error] = await executeQuery(USER_QUERIES.SELECT_ALL);
    
    if (error) {
      return createErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return createSuccessResponse(rows);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch users', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// POST create new user
export async function POST(request: NextRequest) {
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

    // Insert user
    const [result, insertError]: any = await executeQuery(USER_QUERIES.INSERT, [name, email]);
    
    if (insertError) {
      return createErrorResponse(insertError.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Fetch created user
    const insertId = (result as any).insertId;
    const [newUser, fetchError]: any = await executeQuery(USER_QUERIES.SELECT_BY_ID, [insertId]);
    
    if (fetchError || !newUser[0]) {
      return createErrorResponse('Failed to fetch created user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return createSuccessResponse(newUser[0], HTTP_STATUS.CREATED, API_MESSAGES.USER_CREATED);
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

