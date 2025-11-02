import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { dni, password } = await request.json()

    if (!dni || !password) {
      return NextResponse.json({ error: "DNI y contraseña son requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.from("users").select("*").eq("dni", dni).maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: "DNI o contraseña incorrectos" }, { status: 401 })
    }

    const passwordMatch = password === user.password

    if (!passwordMatch) {
      return NextResponse.json({ error: "DNI o contraseña incorrectos" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("mancrol_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        dni: user.dni,
        full_name: user.full_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
