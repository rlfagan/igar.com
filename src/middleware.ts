import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Enable maintenance mode
  const isMaintenanceMode = true

  // Allow access to maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next()
  }

  // Redirect all other traffic to maintenance page
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
