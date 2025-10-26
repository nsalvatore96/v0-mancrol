import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UsersTable } from "@/components/users-table"
import { CreateUserDialog } from "@/components/create-user-dialog"

export default async function AdministracionPage() {
  const supabase = await createClient()

  // Get all users with their permissions
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  // Get all permissions for all users
  const { data: permissions } = await supabase.from("user_permissions").select("*")

  // Map permissions to users
  const usersWithPermissions = users?.map((user) => ({
    ...user,
    permissions: permissions?.filter((p) => p.user_id === user.id) || [],
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mancrol-text">Administración de Usuarios</h1>
          <p className="text-muted-foreground">Gestionar usuarios y permisos del sistema</p>
        </div>
        <CreateUserDialog>
          <Button className="bg-mancrol-primary hover:bg-mancrol-dark">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </CreateUserDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>Lista completa de usuarios registrados con sus permisos</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={usersWithPermissions || []} />
        </CardContent>
      </Card>
    </div>
  )
}
