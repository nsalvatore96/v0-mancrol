"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, UserPlus, UserMinus, Edit, Shield } from "lucide-react"

interface AuditLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown>
  created_at: string
  user?: {
    dni: string
    full_name: string
  }
}

interface AuditLogsTableProps {
  logs: AuditLog[]
}

const ACTION_LABELS: Record<string, string> = {
  create_user: "Crear Usuario",
  update_user: "Actualizar Usuario",
  delete_user: "Eliminar Usuario",
  update_permissions: "Actualizar Permisos",
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  create_user: UserPlus,
  update_user: Edit,
  delete_user: UserMinus,
  update_permissions: Shield,
}

const ACTION_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  create_user: "default",
  update_user: "secondary",
  delete_user: "destructive",
  update_permissions: "outline",
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const getActionIcon = (action: string) => {
    const Icon = ACTION_ICONS[action] || FileText
    return <Icon className="h-4 w-4" />
  }

  const formatDetails = (details: Record<string, unknown>) => {
    if (!details) return "-"

    const entries = Object.entries(details)
    if (entries.length === 0) return "-"

    return entries
      .map(([key, value]) => {
        if (key === "permissions") {
          const perms = value as Record<string, boolean>
          const enabled = Object.entries(perms)
            .filter(([, v]) => v)
            .map(([k]) => k)
          return `Permisos: ${enabled.join(", ") || "ninguno"}`
        }
        if (key === "password_changed") {
          return value ? "Contraseña modificada" : ""
        }
        return `${key}: ${value}`
      })
      .filter(Boolean)
      .join(", ")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No hay registros de auditoría
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {new Date(log.created_at).toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{log.user?.full_name || "Sistema"}</span>
                    <span className="text-xs text-muted-foreground">DNI: {log.user?.dni || "-"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={ACTION_COLORS[log.action] || "default"} className="flex w-fit items-center gap-1">
                    {getActionIcon(log.action)}
                    {ACTION_LABELS[log.action] || log.action}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">
                  <span className="text-sm text-muted-foreground">{formatDetails(log.details)}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
