import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const pathname = url.pathname; // Original pathname

  // Log the hostname and pathname for every request the middleware handles
  console.log(`Middleware processing: Host=${hostname}, Path=${pathname}`);

  // Clone the request headers so we can modify them
  const requestHeaders = new Headers(req.headers);
  // let tenantSlug: string | null = null; // We'll primarily use headers directly

  // Case 1: Main Admin Subdomain (admin.obrtniknaspletu.si)
  if (hostname === 'admin.obrtniknaspletu.si') {
    requestHeaders.set('X-Tenant-Slug', 'admin'); // This host always implies the 'admin' tenant context
    if (pathname === '/') {
       url.pathname = '/admin'; // Rewrite root to /admin
       console.log(`Rewriting admin host root '${hostname}${pathname}' to '${url.pathname}'`);
       return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    // For any other path on admin.obrtniknaspletu.si (e.g., /admin/users, or if /admin is explicitly typed),
    // just pass through with the 'admin' slug header. No rewrite needed.
    console.log(`Passing through admin host '${hostname}${pathname}' with tenant slug 'admin'`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Case 2: Specific Tenant Hostnames (e.g., a1-instalacije.vercel.app)
  if (
    hostname === 'a1-instalacije.vercel.app' ||
    hostname === 'a1-instalacije.local:3000'
  ) {
    const currentTenantSlug = 'a1-instalacije';
    requestHeaders.set('X-Tenant-Slug', currentTenantSlug);

    // Handle /admin path specifically for this tenant's domain
    if (pathname === '/admin') {
      url.pathname = '/admin'; // Rewrite to the common /admin application path
      console.log(`Rewriting tenant host '${hostname}${pathname}' to '${url.pathname}' (tenant: ${currentTenantSlug}) for admin access`);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    
    // For other paths on this tenant's domain, rewrite to /tenant-slugs/TENANT_SLUG/...
    // Avoid rewrite if path already starts with /tenant-slugs (which is the target structure)
    if (!pathname.startsWith('/tenant-slugs')) { 
      const tenantPathBase = `/tenant-slugs/${currentTenantSlug}`;
      let adjustedPathname = pathname.replace(/^\/|\/$/g, ''); // remove leading/trailing slashes, '/' becomes ''
      
      url.pathname = adjustedPathname === '' ? tenantPathBase : `${tenantPathBase}/${adjustedPathname}`;
      console.log(`Rewriting tenant host '${hostname}${pathname}' to '${url.pathname}'`);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    // If path was /admin (handled above) or already correctly prefixed (e.g. /tenant-slugs/a1-instalacije/foo),
    // it will fall through to NextResponse.next() at the end, with X-Tenant-Slug header correctly set.
    console.log(`Passing through tenant host '${hostname}${pathname}' with tenant slug '${currentTenantSlug}' (no rewrite as path is already /tenant-slugs/... or was /admin)`);
  }

  // Case 3: Path-based tenant identification for generic hosts (e.g., localhost, .vercel.app previews)
  // This runs if X-Tenant-Slug hasn't been set by a specific hostname rule.
  if (!requestHeaders.has('X-Tenant-Slug') && 
      (hostname === 'localhost:3000' || hostname.includes('.vercel.app'))) {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'tenant-slugs' && pathSegments[1]) {
      const pathTenantSlug = pathSegments[1];
      requestHeaders.set('X-Tenant-Slug', pathTenantSlug);
      console.log(`Extracted tenant '${pathTenantSlug}' from path '${pathname}' for host '${hostname}' and set header.`);
      // No rewrite needed; path is already the internal representation. Just ensure header is set.
    }
  }

  // Case 4: Set default tenant slug if no specific tenant context was determined by preceding rules
  if (!requestHeaders.has('X-Tenant-Slug')) {
    requestHeaders.set('X-Tenant-Slug', 'default');
    console.log(`Setting tenant slug to 'default' for host '${hostname}${pathname}' as no other rules applied.`);
  }

  // If no rewrite rule above returned a response, proceed with the request (with potentially modified headers)
  console.log(`Final pass-through for '${hostname}${pathname}' with tenant slug '${requestHeaders.get('X-Tenant-Slug')}'`);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}