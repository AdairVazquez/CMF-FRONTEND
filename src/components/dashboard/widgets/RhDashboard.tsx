"use client"

import { AlertCircle, RefreshCwIcon, UserCheck, UserPlus, UserX } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAttendanceToday,
  useAttendanceWeekly,
  useEmployees,
  useLeaveRequests,
} from "@/hooks/useApi"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const chartConfig = {
  present: { label: "Presentes", color: "#059669" },
  absent: { label: "Ausentes", color: "#EF4444" },
  late: { label: "Retardos", color: "#D97706" },
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

export function RhDashboard() {
  const { data: today, isLoading: loadingToday, isError } = useAttendanceToday()
  const { data: weekly, isLoading: loadingWeekly } = useAttendanceWeekly()
  const { data: employees, isLoading: loadingEmployees } = useEmployees()
  const { data: leaves, isLoading: loadingLeaves } = useLeaveRequests()

  const isLoading = loadingToday || loadingWeekly || loadingEmployees || loadingLeaves

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
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
        <p className="text-sm text-muted-foreground">Error al cargar los datos</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const pendingLeaves = leaves?.filter((l) => l.status === "pendiente").length ?? 0
  const totalEmployees = employees?.data?.length ?? 0
  const currentMonth = format(new Date(), "MMMM", { locale: es })
  const newThisMonth = employees?.data?.filter((e) => {
    const created = new Date(e.created_at)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length ?? 0

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-500" /> Presentes hoy
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-500">
              {today?.present ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">de {today?.total ?? 0} empleados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserX className="h-4 w-4 text-destructive" /> Ausentes / Retardos
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive">
              {(today?.absent ?? 0) + (today?.late ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {today?.absent ?? 0} ausentes · {today?.late ?? 0} retardos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ausencias pendientes</CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-500">{pendingLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Por aprobar o rechazar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserPlus className="h-4 w-4" /> Nuevos en {currentMonth}
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{newThisMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">de {totalEmployees} empleados</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica + ausencias pendientes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asistencia semanal</CardTitle>
            <CardDescription>Presentes, ausentes y retardos</CardDescription>
          </CardHeader>
          <CardContent>
            {weekly && weekly.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={weekly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="present" fill="#059669" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="late" fill="#D97706" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="absent" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">Sin datos de la semana</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes pendientes</CardTitle>
            <CardDescription>Requieren aprobación de RH</CardDescription>
          </CardHeader>
          <CardContent>
            {leaves && leaves.filter((l) => l.status === "pendiente").length > 0 ? (
              <div className="flex flex-col gap-2">
                {leaves
                  .filter((l) => l.status === "pendiente")
                  .slice(0, 6)
                  .map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{leave.employee.full_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {leave.type} · {leave.start_date}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                        Pendiente
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">Sin solicitudes pendientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
