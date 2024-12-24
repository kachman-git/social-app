import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const publicPaths = ['/', '/signin', '/signup']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)
  const isAuthPath = ['/signin', '/signup'].includes(request.nextUrl.pathname)

  // Store the original URL to redirect back after auth
  const returnTo = request.nextUrl.pathname

  // If the user is on an auth page and is already logged in,
  // redirect them to the dashboard or their original destination
  if (token && isAuthPath) {
    const redirectTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // If the user is trying to access a protected route and isn't logged in,
  // redirect them to the login page with the return URL
  if (!token && !isPublicPath) {
    const searchParams = new URLSearchParams({
      returnTo: returnTo,
    })
    return NextResponse.redirect(
      new URL(`/signin?${searchParams}`, request.url)
    )
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

