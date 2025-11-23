import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

/**
 * Get allowed origins for CORS
 */
function getAllowedOrigins() {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptafurniturenashik.in',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
  // Remove undefined/null values
  return allowedOrigins.filter(Boolean);
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response, origin) {
  const allowedOrigins = getAllowedOrigins();
  
  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}

/**
 * Verify admin authentication from JWT token in cookies
 * @param {Request} request - Next.js request object
 * @returns {NextResponse|null} - Returns error response if unauthorized, null if authenticated
 */
export async function verifyAdminAuth(request) {
  const origin = request.headers.get('origin');
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, origin);
  }
  
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Authentication required' },
      { status: 401 }
    );
    return addCorsHeaders(response, origin);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return null; // Authentication successful
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    );
    return addCorsHeaders(response, origin);
  }
}

/**
 * Add CORS headers to public API responses
 */
export function addPublicCorsHeaders(response, request) {
  const origin = request.headers.get('origin');
  return addCorsHeaders(response, origin);
}
