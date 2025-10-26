"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)

    if (paths.length === 1 && paths[0] === "dashboard") {
      return [{ label: "Inicio", href: "/dashboard", isActive: true }]
    }

    const breadcrumbs = [{ label: "Inicio", href: "/dashboard", isActive: false }]

    if (paths.includes("administracion")) {
      breadcrumbs.push({ label: "Administración", href: "/dashboard/administracion", isActive: true })
    } else if (paths.includes("auditoria")) {
      breadcrumbs.push({ label: "Auditoría", href: "/dashboard/auditoria", isActive: true })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {crumb.isActive ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
