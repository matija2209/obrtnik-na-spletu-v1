import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const pathname = url.pathname; // Original pathname

  // Specific rewrite for admin subdomain root
  if (hostname === 'admin.obrtniknaspletu.si' && pathname === '/') {
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // If the path starts with /admin, let it pass through directly
  // if (pathname.startsWith('/admin')) {
  //   return NextResponse.next();
  // }

  const tenantSlugPrefix = '/tenant-slugs/';
  let tenantSlug: string | null = null;

  // Map hostnames to the same tenant slug
  if (
    hostname === 'a1-instalacije.vercel.app' ||
    hostname === 'a1-instalacije.local:3000'
  ) {
    tenantSlug = 'a1-instalacije'; // Use the desired slug here
  }

  // If a tenant slug was determined, rewrite the URL
  if (tenantSlug) {
    const tenantPath = `${tenantSlugPrefix}${tenantSlug}`;
    let adjustedPathname = pathname;

    // Remove leading/trailing slashes from the original pathname for consistent joining
    if (adjustedPathname.startsWith('/')) {
      adjustedPathname = adjustedPathname.substring(1);
    }
    if (adjustedPathname.endsWith('/')) {
       adjustedPathname = adjustedPathname.substring(0, adjustedPathname.length - 1);
    }

    if (adjustedPathname === '') {
       url.pathname = tenantPath;
    } else {
       url.pathname = `${tenantPath}/${adjustedPathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // Default: No rewrite
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}