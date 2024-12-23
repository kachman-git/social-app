import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const publicPaths = ['/', '/signin', '/signup']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)
  const isAuthPath = ['/signin', '/signup'].includes(request.nextUrl.pathname)

  // Redirect authenticated users away from auth pages
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Require authentication for all other paths
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
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
}

