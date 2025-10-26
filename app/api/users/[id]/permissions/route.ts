import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { permissions } = await request.json()

    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Update each permission
    const updates = Object.entries(permissions).map(([slug, enabled]) =>
      supabase
        .from("user_permissions")
        .upsert(
          {
            user_id: id,
            permission_slug: slug,
            enabled: enabled as boolean,
          },
          {
            onConflict: "user_id,permission_slug",
          },
        )
        .select(),
    )

    await Promise.all(updates)

    // Log audit
    await supabase.from("audit_logs").insert({
      user_id: authUser.user_metadata?.user_id,
      action: "update_permissions",
      entity_type: "user_permissions",
      entity_id: id,
      details: { permissions },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update permissions error:", error)
    return NextResponse.json({ error: "Error al actualizar permisos" }, { status: 500 })
  }
}
