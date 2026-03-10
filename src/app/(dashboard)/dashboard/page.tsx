"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, Monitor, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { getGreeting, getUserRole } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
      <h2 className="text-base font-semibold mb-4" style={{ color: "#B9C0C8" }}>{title}</h2>
      <div className="flex items-center justify-center h-32">
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Los datos estarán disponibles próximamente
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user ? getUserRole(user) : "director";
  const [clock, setClock] = useState("");

  useEffect(() => {
    // Redirect super_admin to their dedicated dashboard
    if (role === "super_admin") {
      router.replace("/dashboard/super");
      return;
    }
    // Redirect rh/jefe_area to asistencia
    if (role === "rh" || role === "jefe_area") {
      router.replace("/dashboard/asistencia");
      return;
    }
    // Redirect operador to dispositivos
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

  // Show loading if redirecting
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Empleados presentes" value={0}  icon={Users}    accent="#2F80ED" description="Asistencia de hoy"   index={0} />
        <StatCard title="Registros de hoy"    value={0}  icon={Clock}    accent="#059669" description="Entradas y salidas"  index={1} />
        <StatCard title="Retardos del día"    value={0}  icon={Activity} accent="#f97316" description="Llegadas tarde"      index={2} />
        <StatCard title="Dispositivos activos" value={0} icon={Monitor}  accent="#a855f7" description="Lectores en línea"   index={3} />
      </div>

      <PlaceholderCard title="Asistencia semanal" />
      <PlaceholderCard title="Últimas entradas y salidas" />
    </div>
  );
}
