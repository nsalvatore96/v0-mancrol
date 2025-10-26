"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Shield } from "lucide-react"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { DeleteUserDialog } from "@/components/delete-user-dialog"
import { ManagePermissionsDialog } from "@/components/manage-permissions-dialog"

interface User {
  id: string
  dni: string
  full_name: string
  created_at: string
  permissions: Array<{
    permission_slug: string
    enabled: boolean
  }>
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user)
    setPermissionsDialogOpen(true)
  }

  const getActivePermissionsCount = (user: User) => {
    return user.permissions.filter((p) => p.enabled).length
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Permisos Activos</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.dni}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getActivePermissionsCount(user)} permisos</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("es-AR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleManagePermissions(user)}>
                        <Shield className="h-4 w-4" />
                        <span className="sr-only">Gestionar permisos</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <EditUserDialog user={selectedUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
          <DeleteUserDialog user={selectedUser} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
          <ManagePermissionsDialog
            user={selectedUser}
            open={permissionsDialogOpen}
            onOpenChange={setPermissionsDialogOpen}
          />
        </>
      )}
    </>
  )
}
