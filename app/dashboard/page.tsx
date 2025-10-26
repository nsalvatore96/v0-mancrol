import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Shield } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user data from our custom users table
  const { data: userData } = await supabase.from("users").select("*").eq("id", user?.user_metadata?.user_id).single()

  // Get statistics
  const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: auditCount } = await supabase.from("audit_logs").select("*", { count: "exact", head: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mancrol-text">Bienvenido, {userData?.full_name || "Usuario"}</h1>
        <p className="text-muted-foreground">Sistema de Administración Mancrol</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-mancrol-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros de Auditoría</CardTitle>
            <FileText className="h-4 w-4 text-mancrol-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditCount || 0}</div>
            <p className="text-xs text-muted-foreground">Eventos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permisos Activos</CardTitle>
            <Shield className="h-4 w-4 text-mancrol-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Tipos de permisos disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
          <CardDescription>Accede a las funciones principales del sistema</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <a
            href="/dashboard/administracion"
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <Users className="h-8 w-8 text-mancrol-primary" />
            <div>
              <h3 className="font-semibold">Administración de Usuarios</h3>
              <p className="text-sm text-muted-foreground">Gestionar usuarios y permisos</p>
            </div>
          </a>
          <a
            href="/dashboard/auditoria"
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <FileText className="h-8 w-8 text-mancrol-primary" />
            <div>
              <h3 className="font-semibold">Auditoría</h3>
              <p className="text-sm text-muted-foreground">Ver registro de cambios</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
