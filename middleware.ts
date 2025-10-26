import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Update session
  const response = await updateSession(request)

  // Check if user is authenticated for protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const supabase = response.headers.get("x-supabase-user")

    if (!supabase) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname === "/login") {
    const supabase = response.headers.get("x-supabase-user")

    if (supabase) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
