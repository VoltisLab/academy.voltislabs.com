import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the incoming request
  const response = NextResponse.next();
  
  // Add CORS headers for PDF.js worker to all routes
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  
  // Get token from cookies
  const token = request.cookies.get('user');
  const pathname = request.nextUrl.pathname;

  // Only do authentication checks on specific protected routes
  const protectedRoutes = [
    '/dashboard',
    '/bootcamp',
    '/articles',
    '/contact',
    '/instructor'
  ];
  
  // Check if the current path is a protected route or under /dashboard/
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    protectedRoutes.some(route => pathname === route);
  
  // Redirect to home if trying to access a protected route without authentication
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Return the response with added headers
  return response;
}

// Apply middleware to ALL routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};