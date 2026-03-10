"use client"

import { SiteHeader } from "@/components/dashboard/SiteHeader"
import { DirectorDashboard } from "@/components/dashboard/widgets/DirectorDashboard"
import { JefeAreaDashboard } from "@/components/dashboard/widgets/JefeAreaDashboard"
import { OperadorDashboard } from "@/components/dashboard/widgets/OperadorDashboard"
import { RhDashboard } from "@/components/dashboard/widgets/RhDashboard"
import { SuperAdminDashboard } from "@/components/dashboard/widgets/SuperAdminDashboard"
import { DASHBOARD_BY_ROLE } from "@/config/dashboard-by-role"
import { useAuthStore } from "@/store/authStore"
import { getUserRole } from "@/types/auth"

const WIDGET_MAP = {
  SuperAdminDashboard,
  DirectorDashboard,
  RhDashboard,
  JefeAreaDashboard,
  OperadorDashboard,
} as const

export default function DashboardPage() {
  const { user } = useAuthStore()
  const role = user ? getUserRole(user) : "operador"
  const config = DASHBOARD_BY_ROLE[role] ?? DASHBOARD_BY_ROLE.operador
  const Widget = WIDGET_MAP[config.widget]

  return (
    <>
      <SiteHeader title={config.title} />
      <div className="flex flex-1 flex-col overflow-auto">
        <Widget />
      </div>
    </>
  )
}
