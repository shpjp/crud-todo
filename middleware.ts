import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge-safe middleware
 * ONLY checks for cookie presence - NO JWT verification, NO Prisma
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // API routes are handled by their own authentication logic
  const isApiRoute = pathname.startsWith('/api');

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute && !isApiRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login/signup
  if (token && isPublicRoute) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
