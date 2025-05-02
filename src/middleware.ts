import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  if (hostname === 'a1-instalacije.vercel.app') {
    if (url.pathname === '/') {
      url.pathname = '/tenant-slugs/a1-instalacije.vercel.app';
    } else {
      url.pathname = `/tenant-slugs/a1-instalacije.vercel.app/${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}