import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, isAuthenticated } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(SESSION_COOKIE)?.value
  const authed = isAuthenticated(session)

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/login")) {
    if (authed) return NextResponse.redirect(new URL("/issues", request.url))
    return NextResponse.next()
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
