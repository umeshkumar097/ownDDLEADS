import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // Define root domains
  const rootDomains = ['dhandaleads.com', 'www.dhandaleads.com', 'localhost:3000', 'localhost:3002'];
  
  // Check if we are on a subdomain
  const isSubdomain = hostname && !rootDomains.includes(hostname);

  if (isSubdomain) {
    const subdomain = hostname.split('.')[0];
    
    // Skip if it's an internal Next.js request
    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    // Rewrite to the agency route
    console.log(`[Middleware] Rewriting ${hostname}${url.pathname} to /agency/${subdomain}${url.pathname}`);
    return NextResponse.rewrite(new URL(`/agency/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
