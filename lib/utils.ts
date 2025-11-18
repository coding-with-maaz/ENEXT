import { NextResponse } from 'next/server';
import { HTTP_STATUS, API_MESSAGES } from './constants';

// Type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Create success response
export function createSuccessResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

// Create error response
export function createErrorResponse(
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate required fields
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingField?: string } {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      return { isValid: false, missingField: field };
    }
  }
  return { isValid: true };
}

// Parse number safely
export function parseNumber(value: any, defaultValue: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Parse integer safely
export function parseIntSafe(value: any, defaultValue: number = 0): number {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Format datetime
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

