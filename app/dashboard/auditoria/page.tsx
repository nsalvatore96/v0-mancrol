import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditLogsTable } from "@/components/audit-logs-table"

export default async function AuditoriaPage() {
  const supabase = await createClient()

  // Get all audit logs with user information
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select(
      `
      *,
      user:users!audit_logs_user_id_fkey(dni, full_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mancrol-text">Auditoría del Sistema</h1>
        <p className="text-muted-foreground">Registro completo de cambios y acciones en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Auditoría</CardTitle>
          <CardDescription>Últimos 100 eventos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogsTable logs={auditLogs || []} />
        </CardContent>
      </Card>
    </div>
  )
}
