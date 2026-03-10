"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface CmfNavItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: number
}

export interface CmfNavGroup {
  section: string
  items: CmfNavItem[]
}

export function NavMain({ groups }: { groups: CmfNavGroup[] }) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.section}>
          <SidebarGroupLabel>{group.section}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== "/dashboard" &&
                  pathname.startsWith(item.url + "/"))

              return (
                <SidebarMenuItem key={item.url} className="nav-item">
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge != null && item.badge > 0 && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
