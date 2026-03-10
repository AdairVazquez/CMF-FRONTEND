"use client"

import { AlertCircle, Building2, RefreshCwIcon, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useCompanies } from "@/hooks/useApi"
import type { CompanyStatus } from "@/types/company"

const STATUS_LABEL: Record<CompanyStatus, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  suspendido: "Suspendido",
  prueba: "Prueba",
}

const STATUS_VARIANT: Record<CompanyStatus, "default" | "secondary" | "destructive" | "outline"> = {
  activo: "default",
  inactivo: "secondary",
  suspendido: "destructive",
  prueba: "outline",
}

const chartConfig = {
  activo: { label: "Activas", color: "#059669" },
  inactivo: { label: "Inactivas", color: "#6B7280" },
  suspendido: { label: "Suspendidas", color: "#EF4444" },
} satisfies ChartConfig

function KpiSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-16 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

export function SuperAdminDashboard() {
  const { data: companies, isLoading, isError, refetch } = useCompanies()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar los datos del sistema</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const total = companies?.length ?? 0
  const active = companies?.filter((c) => c.status === "activo").length ?? 0
  const inactive = companies?.filter((c) => c.status === "inactivo").length ?? 0
  const suspended = companies?.filter((c) => c.status === "suspendido").length ?? 0

  const chartData = [
    { estado: "Activas", cantidad: active },
    { estado: "Inactivas", cantidad: inactive },
    { estado: "Suspendidas", cantidad: suspended },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> Total de empresas
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-emerald-500" /> Empresas activas
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-500">{active}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? Math.round((active / total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Ingresos SaaS
            </CardDescription>
            <CardTitle className="text-3xl font-bold">—</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Disponible próximamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Suspendidas</CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive">{suspended}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica + tabla */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Empresas por estado</CardTitle>
            <CardDescription>Distribución actual en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="estado" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} fill="#2F80ED" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresas recientes</CardTitle>
            <CardDescription>Últimas registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {companies && companies.length > 0 ? (
              <div className="flex flex-col gap-2">
                {companies.slice(0, 6).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm font-medium truncate">{company.name}</span>
                    <Badge variant={STATUS_VARIANT[company.status]} className="text-xs shrink-0 ml-2">
                      {STATUS_LABEL[company.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sin empresas registradas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
