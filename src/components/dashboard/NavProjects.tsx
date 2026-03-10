"use client"

import { useRouter } from "next/navigation"
import {
  ExternalLinkIcon,
  LinkIcon,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore"
import { getUserRole } from "@/types/auth"

export interface NavProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

export function NavProjects({
  projects,
  label = "Accesos Rápidos",
}: {
  projects: NavProjectItem[]
  label?: string
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user } = useAuthStore()
  const role = user ? getUserRole(user) : "operador"
  const isSuperAdmin = role === "super_admin"

  if (projects.length === 0) return null

  function handleView(url: string) {
    router.push(url)
  }

  function handleShare(url: string, name: string) {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => toast.success(`Enlace de "${name}" copiado al portapapeles`))
      .catch(() => toast.error("No se pudo copiar el enlace"))
  }

  function handleDelete(name: string) {
    // Solo super_admin puede eliminar — mostrar confirmación en consola por ahora
    // En producción: abrir modal de confirmación y llamar al endpoint DELETE
    toast.warning(`Eliminar "${name}" requiere confirmación — funcionalidad próximamente`)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">Opciones</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleView(item.url)}
                >
                  <ExternalLinkIcon className="text-muted-foreground" />
                  <span>Ver</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare(item.url, item.name)}
                >
                  <LinkIcon className="text-muted-foreground" />
                  <span>Copiar enlace</span>
                </DropdownMenuItem>
                {isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => handleDelete(item.name)}
                    >
                      <Trash2 className="text-destructive" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
