"use client"

import { CmfIcon } from "@/components/shared/CmfIcon"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  name,
  plan,
}: {
  name: string
  plan: string
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent active:bg-transparent">
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)",
            }}
          >
            <CmfIcon size={16} color="#F4F6F8" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span
              className="truncate font-semibold"
              style={{
                background: "linear-gradient(135deg, #B9C0C8 0%, #F4F6F8 40%, #B9C0C8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {name}
            </span>
            <span className="truncate text-xs opacity-50">{plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
