import { ChangePasswordForm } from "@/components/change-password-form"

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cambiar Contraseña</h1>
        <p className="text-muted-foreground mt-2">Actualiza tu contraseña de acceso al sistema</p>
      </div>

      <div className="max-w-2xl">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
