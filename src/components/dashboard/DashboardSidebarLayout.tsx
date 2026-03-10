"use client"

import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export function DashboardSidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-auto border-l border-sidebar-border">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-4 md:px-6">
          {children}
        </div>
      </SidebarInset>
    </>
  )
}
