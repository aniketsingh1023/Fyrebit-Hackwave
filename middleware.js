import { NextResponse } from "next/server"

export function middleware(request) {
  const isAuthenticated = request.headers.get("x-authenticated") || request.cookies.get("isAuthenticated")?.value

  // Protected routes
  const protectedPaths = ["/home", "/dashboard", "/profile", "/categories"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to home if accessing auth pages while authenticated
  const authPaths = ["/login", "/signup"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*", "/profile/:path*", "/categories/:path*", "/login", "/signup"],
}
