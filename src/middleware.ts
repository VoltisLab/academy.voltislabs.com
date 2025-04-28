import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user');

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/dashboard') ||
    pathname === '/bootcamp' ||
    pathname === '/articles' ||
    pathname === '/contact' ||
    pathname === '/instructor'
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/bootcamp', '/articles', '/contact', '/instructor'],
};
