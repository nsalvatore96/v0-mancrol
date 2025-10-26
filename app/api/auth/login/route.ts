import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { dni, password } = await request.json()

    if (!dni || !password) {
      return NextResponse.json({ error: "DNI y contraseña son requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user by DNI
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("dni", dni).single()

    if (userError || !user) {
      return NextResponse.json({ error: "DNI o contraseña incorrectos" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "DNI o contraseña incorrectos" }, { status: 401 })
    }

    // Create session using Supabase Auth with custom user metadata
    // We'll use the admin key to create a session for this user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `${dni}@mancrol.internal`,
      password: password,
      email_confirm: true,
      user_metadata: {
        dni: user.dni,
        full_name: user.full_name,
        user_id: user.id,
      },
    })

    if (authError) {
      // User might already exist in auth, try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${dni}@mancrol.internal`,
        password: password,
      })

      if (signInError) {
        return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
