"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/dashboard/Header"
import { useAuthStore } from "@/store/authStore"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0D12" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#2F80ED" }}
        />
      </div>
    )
  }

  return (
    <SidebarProvider
      className="h-screen overflow-hidden"
      style={{ background: "#0A0D12" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
