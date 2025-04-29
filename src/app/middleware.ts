import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Don't rewrite paths that should remain unchanged
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/tenant-domains') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Get the tenant from the hostname
  const hostname = request.headers.get('host') || '';
  
  // Use the full hostname as the tenant identifier
  const tenant = hostname;
  
  // For debugging (remove in production)
  console.log(`Using hostname as tenant: ${tenant}, Original path: ${pathname}`);
  
  // Rewrite to tenant domains path, using the full hostname
  url.pathname = `/tenant-domains/${tenant}${pathname}`;
  
  return NextResponse.rewrite(url);
}

// Match all paths except static assets and API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};