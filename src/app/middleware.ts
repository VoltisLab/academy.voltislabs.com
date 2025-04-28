// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define which paths should be protected
  if (pathname.startsWith('/dashboard')) {
    const token = localStorage.getItem('user') // Check if the user has a valid token
    
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Allow the request to continue if authenticated
  return NextResponse.next();
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    // Apply this middleware to paths starting with '/protected'
    '/dashboard/:path*',
    '/dashboard/:path*',
    // You can add more paths that need authentication here
  ]
};