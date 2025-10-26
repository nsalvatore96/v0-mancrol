import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { dni, full_name, password } = await request.json()

    if (!dni || !full_name || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Check if DNI already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("dni", dni).single()

    if (existingUser) {
      return NextResponse.json({ error: "El DNI ya está registrado" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        dni,
        full_name,
        password_hash,
        created_by: authUser.user_metadata?.user_id,
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    // Create default permissions (all disabled)
    const defaultPermissions = [
      { user_id: newUser.id, permission_slug: "modificar_usuarios", enabled: false },
      { user_id: newUser.id, permission_slug: "gestionar_rutas", enabled: false },
    ]

    await supabase.from("user_permissions").insert(defaultPermissions)

    // Log audit
    await supabase.from("audit_logs").insert({
      user_id: authUser.user_metadata?.user_id,
      action: "create_user",
      entity_type: "user",
      entity_id: newUser.id,
      details: { dni, full_name },
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("[v0] Create user error:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
