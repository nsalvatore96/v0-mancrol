import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get("mancrol_user_id")?.value

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!userId) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname === "/login") {
    if (userId) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
