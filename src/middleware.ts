import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const pathname = url.pathname; // Original pathname

  // Log the hostname and pathname for every request the middleware handles
  console.log(`Middleware processing: Host=${hostname}, Path=${pathname}`);

  // Clone the request headers so we can modify them
  const requestHeaders = new Headers(req.headers);

  let tenantSlug: string | null = null;
  let isRewrite = false;

  // Specific rewrite for admin subdomain root
  if (hostname === 'admin.obrtniknaspletu.si') {
    if (pathname === '/') {
       url.pathname = '/admin';
       requestHeaders.set('X-Tenant-Slug', 'admin'); 
       return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    } else {
        // Allow other paths under admin subdomain, maybe set header too?
        requestHeaders.set('X-Tenant-Slug', 'admin');
        // No rewrite needed, just pass through with header
        return NextResponse.next({ request: { headers: requestHeaders } });
    }
  }

  // 1. Check for specific hostnames first
  if (
    hostname === 'a1-instalacije.vercel.app' ||
    hostname === 'a1-instalacije.local:3000'
  ) {
    tenantSlug = 'a1-instalacije';
  }

  // 2. If no specific hostname match, check if path indicates tenant (for internal requests)
  if (!tenantSlug && (hostname === 'localhost:3000' || hostname.includes('.vercel.app'))) { // Add other generic hosts if needed
      const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments
      if (pathSegments[0] === 'tenant-slugs' && pathSegments[1]) {
          tenantSlug = pathSegments[1];
          console.log(`Extracted tenant '${tenantSlug}' from path for host '${hostname}'`);
          // Don't rewrite URL here, path is already correct
      }
  }

  // 3. Set header based on determined slug (or default)
  if (tenantSlug) {
    requestHeaders.set('X-Tenant-Slug', tenantSlug);
  } else {
    requestHeaders.set('X-Tenant-Slug', 'default');
  }

  // 4. Rewrite ONLY if it was based on HOSTNAME (initial request)
  if ((
      hostname === 'a1-instalacije.vercel.app' ||
      hostname === 'a1-instalacije.local:3000'
    ) && !pathname.startsWith('/tenant-slugs')) { // Avoid rewrite loop
      
      const tenantPath = `/tenant-slugs/${tenantSlug}`; // Use the identified slug
      let adjustedPathname = pathname.replace(/^\/|\/$/g, '');

      url.pathname = adjustedPathname === '' ? tenantPath : `${tenantPath}/${adjustedPathname}`;
      console.log(`Rewriting host '${hostname}' path '${pathname}' to '${url.pathname}'`);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // 5. Otherwise, just continue with potentially modified headers
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}