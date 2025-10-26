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

    const { data: existingUser } = await supabase.from("users").select("id").eq("dni", dni).maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: "El DNI ya está registrado" }, { status: 400 })
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        dni,
        full_name,
        password_hash: hashedPassword,
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
      user_id: newUser.id,
      action: "create_user",
      entity_type: "user",
      entity_id: newUser.id,
      details: { dni, full_name },
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
