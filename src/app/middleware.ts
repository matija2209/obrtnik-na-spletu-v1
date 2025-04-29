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
  
  // Extract tenant from hostname
  // For production: a1-instalacije.vercel.app -> tenant is a1-instalacije
  // For subdomains: gold.localhost:3000 -> tenant is gold
  let tenant = hostname
  
  
  // For debugging (remove in production)
  console.log(`Tenant: ${tenant}, Original path: ${pathname}`);
  
  // Rewrite to tenant domains path
  url.pathname = `/tenant-domains${pathname}`;
  
  // If you need to pass the tenant explicitly (might be needed depending on how Payload is configured)
  // url.pathname = `/tenant-domains/${tenant}${pathname}`;
  
  return NextResponse.rewrite(url);
}

// Match all paths except static assets and API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};