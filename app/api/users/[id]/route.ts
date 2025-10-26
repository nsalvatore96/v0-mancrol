import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { dni, full_name, password } = await request.json()

    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Get current user data
    const { data: currentUser } = await supabase.from("users").select("*").eq("id", id).single()

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Check if DNI is being changed and if it already exists
    if (dni !== currentUser.dni) {
      const { data: existingUser } = await supabase.from("users").select("id").eq("dni", dni).single()

      if (existingUser) {
        return NextResponse.json({ error: "El DNI ya está registrado" }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      dni,
      full_name,
      updated_by: authUser.user_metadata?.user_id,
    }

    // Hash new password if provided
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Log audit
    await supabase.from("audit_logs").insert({
      user_id: authUser.user_metadata?.user_id,
      action: "update_user",
      entity_type: "user",
      entity_id: id,
      details: { dni, full_name, password_changed: !!password },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("[v0] Update user error:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Get user data before deletion
    const { data: userToDelete } = await supabase.from("users").select("*").eq("id", id).single()

    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Delete user (permissions will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase.from("users").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    // Log audit
    await supabase.from("audit_logs").insert({
      user_id: authUser.user_metadata?.user_id,
      action: "delete_user",
      entity_type: "user",
      entity_id: id,
      details: { dni: userToDelete.dni, full_name: userToDelete.full_name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete user error:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
