"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { DashboardSidebarLayout } from "@/components/dashboard/DashboardSidebarLayout"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      className="flex min-h-svh w-full overflow-x-hidden"
      style={{ flexDirection: "row" }}
    >
      <DashboardSidebarLayout>{children}</DashboardSidebarLayout>
    </SidebarProvider>
  )
}
