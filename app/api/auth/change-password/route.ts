import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Contraseña actual y nueva son requeridas" }, { status: 400 })
    }

    // Obtener el ID del usuario actual desde la cookie
    const cookieStore = await cookies()
    const userId = cookieStore.get("mancrol_user_id")?.value

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const supabase = await createClient()

    // Obtener el usuario actual
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar que la contraseña actual sea correcta (texto plano)
    if (user.password !== currentPassword) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 401 })
    }

    // Actualizar la contraseña
    const { error: updateError } = await supabase.from("users").update({ password: newPassword }).eq("id", userId)

    if (updateError) {
      return NextResponse.json({ error: "Error al actualizar la contraseña" }, { status: 500 })
    }

    // Registrar en auditoría
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action: "change_password",
      entity_type: "user",
      entity_id: userId,
      details: "Usuario cambió su contraseña",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
