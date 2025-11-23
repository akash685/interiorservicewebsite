import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run on /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      const response = NextResponse.next();
      addSecurityHeaders(response);
      return response;
    } catch (error) {
      // Token invalid or expired
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - configured for Google Analytics, GTM, and Facebook Pixel
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://maps.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://analytics.google.com; " +
    "frame-src 'self' https://www.google.com https://www.googletagmanager.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|hero.png|sitemap.xml|robots.txt).*)',
  ],
};
