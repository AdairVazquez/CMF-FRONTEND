"use client"

import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive"
import { DataTable } from "@/components/dashboard/DataTable"
import { SectionCards } from "@/components/dashboard/SectionCards"
import { SiteHeader } from "@/components/dashboard/SiteHeader"
import { useAuthStore } from "@/store/authStore"
import { getUserRole } from "@/types/auth"

import data from "../data.json"

const ROLE_TITLE: Record<string, string> = {
  super_admin: "Panel General",
  director: "Dashboard",
  rh: "Recursos Humanos",
  jefe_area: "Mi Área",
  operador: "Dispositivos",
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const role = user ? getUserRole(user) : "operador"
  const title = ROLE_TITLE[role] ?? "Dashboard"

  return (
    <>
      <SiteHeader title={title} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
