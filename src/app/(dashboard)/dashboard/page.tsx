"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, Monitor, Activity, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useAuthStore } from "@/store/authStore";
import { getGreeting, getUserRole } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const METRIC_CARDS = [
  {
    title: "Empleados presentes",
    value: "0",
    icon: Users,
    badge: "Hoy",
    trending: "up" as const,
    trendLabel: "Asistencia de hoy",
    subtitle: "Personal que registró entrada",
  },
  {
    title: "Registros de hoy",
    value: "0",
    icon: Clock,
    badge: "Hoy",
    trending: "up" as const,
    trendLabel: "Entradas y salidas",
    subtitle: "Movimientos registrados",
  },
  {
    title: "Retardos del día",
    value: "0",
    icon: Activity,
    badge: "Hoy",
    trending: "down" as const,
    trendLabel: "Llegadas tarde",
    subtitle: "Tolerancia superada",
  },
  {
    title: "Dispositivos activos",
    value: "0",
    icon: Monitor,
    badge: "En línea",
    trending: "up" as const,
    trendLabel: "Lectores en línea",
    subtitle: "Dispositivos NFC conectados",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user ? getUserRole(user) : "director";
  const [clock, setClock] = useState("");

  useEffect(() => {
    if (role === "super_admin") {
      router.replace("/dashboard/super");
      return;
    }
    if (role === "rh" || role === "jefe_area") {
      router.replace("/dashboard/asistencia");
      return;
    }
    if (role === "operador") {
      router.replace("/dashboard/dispositivos");
      return;
    }
  }, [role, router]);

  useEffect(() => {
    const tick = () => setClock(format(new Date(), "HH:mm:ss", { locale: es }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (role !== "director") {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#2F80ED" }}
        />
      </div>
    );
  }

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold gradient-text-premium">
          {user?.name ? getGreeting(user.name) : "Bienvenido"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {user?.company?.name && <>{user.company.name} · </>}
          <span className="capitalize">{today}</span>
          {" · "}
          <span className="font-mono">{clock}</span>
        </p>
      </div>

      {/* Metric Cards — SectionCards style */}
      <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
        {METRIC_CARDS.map((card) => (
          <Card key={card.title} className="@container/card">
            <CardHeader className="relative">
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {card.value}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {card.trending === "up"
                    ? <TrendingUpIcon className="size-3" />
                    : <TrendingDownIcon className="size-3" />}
                  {card.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.trendLabel}
                {card.trending === "up"
                  ? <TrendingUpIcon className="size-4" />
                  : <TrendingDownIcon className="size-4" />}
              </div>
              <div className="text-muted-foreground">{card.subtitle}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Área chart — Tendencia de asistencia */}
      <div className="px-0">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
