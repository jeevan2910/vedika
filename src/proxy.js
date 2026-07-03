import { NextResponse } from 'next/server';

export function proxy(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Get configured domains from environment variables
  const adminDomain = process.env.ADMIN_DOMAIN;

  // Local development bypass: If no admin domain is configured or we are on localhost, allow everything
  if (
    !adminDomain ||
    host.includes('localhost') ||
    host.includes('127.0.0.1')
  ) {
    return NextResponse.next();
  }

  const isRequestingAdmin = url.pathname.startsWith('/admin');

  // Case 1: Accessing via the Admin Domain
  if (host.includes(adminDomain)) {
    // If trying to access storefront pages (not admin, not api, not next.js assets, not public files)
    // redirect them to the admin dashboard
    if (
      !isRequestingAdmin &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/_next') &&
      !url.pathname.includes('.')
    ) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  } 
  
  // Case 2: Accessing via any other domain (e.g. Storefront domain, Vercel preview domain)
  else {
    // Block access to the admin portal completely (rewrite to 404)
    if (isRequestingAdmin) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
