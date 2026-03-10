"use client"

import { AlertCircle, AlertTriangle, CheckCircle2, Monitor, RefreshCwIcon, Wifi, WifiOff } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useAttendanceToday, useDeviceEvents, useDevices } from "@/hooks/useApi"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const chartConfig = {
  online: { label: "En línea", color: "#059669" },
  offline: { label: "Sin conexión", color: "#EF4444" },
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

export function OperadorDashboard() {
  const { data: devices, isLoading: loadingDevices, isError } = useDevices()
  const { data: events, isLoading: loadingEvents } = useDeviceEvents()
  const { data: today, isLoading: loadingToday } = useAttendanceToday()

  const isLoading = loadingDevices || loadingEvents || loadingToday

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar los dispositivos</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const online = devices?.filter((d) => d.status === "online").length ?? 0
  const offline = devices?.filter((d) => d.status === "offline").length ?? 0
  const total = (devices?.length ?? 0)
  const offlineDevices = devices?.filter((d) => d.status === "offline") ?? []

  const chartData = [
    { estado: "En línea", cantidad: online },
    { estado: "Sin conexión", cantidad: offline },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Wifi className="h-4 w-4 text-emerald-500" /> Dispositivos en línea
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-500">{online}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">de {total} registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <WifiOff className="h-4 w-4 text-destructive" /> Sin conexión
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive">{offline}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requieren revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Monitor className="h-4 w-4" /> Total dispositivos
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? Math.round((online / total) * 100) : 0}% operativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Registros hoy</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {(today?.present ?? 0) + (today?.late ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Entradas y salidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica estado + eventos recientes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de dispositivos</CardTitle>
            <CardDescription>Online vs sin conexión</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="estado" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} fill="#2F80ED" />
              </BarChart>
            </ChartContainer>

            {offlineDevices.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" /> Sin conexión reciente
                </p>
                {offlineDevices.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{d.name}</span>
                    <Badge variant="destructive" className="text-xs shrink-0 ml-2">Offline</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos eventos NFC</CardTitle>
            <CardDescription>Registros en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="flex flex-col gap-2">
                {events.slice(0, 8).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          event.type === "entrada" ? "text-emerald-500" : "text-blue-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{event.employee_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatDistanceToNow(new Date(event.recorded_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">Sin eventos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
