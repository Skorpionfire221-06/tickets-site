import { NextResponse } from 'next/server';
export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  if (pathname.startsWith('/t/')) {
    if (!searchParams.get('token')) return NextResponse.rewrite(new URL('/404', req.url));
  }
  return NextResponse.next();
}
