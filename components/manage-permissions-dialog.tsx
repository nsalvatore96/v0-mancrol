"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface User {
  id: string
  dni: string
  full_name: string
  permissions: Array<{
    permission_slug: string
    enabled: boolean
  }>
}

interface ManagePermissionsDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AVAILABLE_PERMISSIONS = [
  { slug: "modificar_usuarios", label: "Modificar Usuarios", description: "Permite crear, editar y eliminar usuarios" },
  { slug: "gestionar_rutas", label: "Gestionar Rutas", description: "Permite administrar rutas del sistema" },
]

export function ManagePermissionsDialog({ user, open, onOpenChange }: ManagePermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const permissionsMap: Record<string, boolean> = {}
    AVAILABLE_PERMISSIONS.forEach((perm) => {
      const userPerm = user.permissions.find((p) => p.permission_slug === perm.slug)
      permissionsMap[perm.slug] = userPerm?.enabled || false
    })
    setPermissions(permissionsMap)
    setError(null)
  }, [user])

  const handleToggle = (slug: string) => {
    setPermissions((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar permisos")
      }

      onOpenChange(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al actualizar permisos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Permisos</DialogTitle>
          <DialogDescription>
            Configure los permisos para <strong>{user.full_name}</strong> (DNI: {user.dni})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {AVAILABLE_PERMISSIONS.map((perm) => (
            <div key={perm.slug} className="flex items-start justify-between space-x-4 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor={perm.slug} className="cursor-pointer text-base font-medium">
                  {perm.label}
                </Label>
                <p className="text-sm text-muted-foreground">{perm.description}</p>
              </div>
              <Switch
                id={perm.slug}
                checked={permissions[perm.slug] || false}
                onCheckedChange={() => handleToggle(perm.slug)}
              />
            </div>
          ))}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-mancrol-primary hover:bg-mancrol-dark" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Permisos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
