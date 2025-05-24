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


  // Handle admin.obrtniknaspletu.si specifically
  if (hostname === 'admin.obrtniknaspletu.si') {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathname === '/') {
      // Root of admin subdomain, rewrite to /admin and set slug to 'admin'
      url.pathname = '/admin';
      requestHeaders.set('X-Tenant-Slug', 'admin');
      console.log(`Rewriting admin host root to /admin, slug: admin`);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    } else if (pathSegments.length > 1 && pathSegments[0] === 'tenant-slugs') {
      // Path like /tenant-slugs/[slug]/... on admin subdomain
      const specificTenantSlug = pathSegments[1];
      requestHeaders.set('X-Tenant-Slug', specificTenantSlug);
      console.log(`Admin host: Path /tenant-slugs/... detected. Slug: ${specificTenantSlug} for path: ${pathname}`);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } else {
      // Other paths on admin subdomain (e.g., /admin, /admin/foo), set slug to 'admin'
      // This is for direct access to Payload admin UI paths.
      requestHeaders.set('X-Tenant-Slug', 'admin');
      console.log(`Admin host: Defaulting to slug 'admin' for path: ${pathname}`);
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

  if (
    hostname === 'moj-mojster-gradnje.vercel.app'
  ) {
    tenantSlug = 'moj-mojster-gradnje';
  }

  if (hostname === "kr-hausbetreuung.vercel.app") {
    tenantSlug = "kr-hausbetreuung";
  }

  if (hostname === "top-tla.vercel.app") {
    tenantSlug = "top-tla";
  }


  // 2. If no specific hostname match, check for direct tenant-slugs path access
  if (!tenantSlug) {
    const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments
    if (pathSegments[0] === 'tenant-slugs' && pathSegments[1]) {
      tenantSlug = pathSegments[1];
      console.log(`Extracted tenant '${tenantSlug}' from path for host '${hostname}'`);
      // No need to rewrite URL here, path is already correct
    }
  }

  // 3. Set header based on determined slug (or default)
  if (tenantSlug) {
    requestHeaders.set('X-Tenant-Slug', tenantSlug);
  } else {
    requestHeaders.set('X-Tenant-Slug', 'default');
  }

  // 4. Rewrite ONLY if it was based on specific HOSTNAME (initial request)
  if ((
      hostname === 'a1-instalacije.vercel.app' ||
      hostname === 'a1-instalacije.local:3000' ||
      hostname === 'moj-mojster-gradnje.vercel.app'
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