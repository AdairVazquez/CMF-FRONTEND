"use client";

import { useEffect, useState } from "react";
import { Clock, Users, Calendar, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
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

export default function AsistenciaPage() {
  const { user } = useAuthStore();
  const role = user ? getUserRole(user) : "rh";
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(format(new Date(), "HH:mm:ss", { locale: es }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });
  const scopeLabel = role === "jefe_area" ? "Tu departamento" : "Empresa completa";

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
          {" · "}
          <span style={{ color: "#2F80ED" }}>{scopeLabel}</span>
        </p>
      </div>

      <PageHeader
        title="Asistencia"
        description={`Registros de entrada y salida del personal — ${scopeLabel}`}
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Clock className="w-5 h-5" style={{ color: "#22c55e" }} />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Presentes hoy"      value={0} icon={Users}       accent="#22c55e" description="En el trabajo"      index={0} />
        <StatCard title="Ausentes hoy"       value={0} icon={Calendar}    accent="#ef4444" description="Sin registro"        index={1} />
        <StatCard title="Registros del día"  value={0} icon={Clock}       accent="#2F80ED" description="Entradas y salidas"  index={2} />
        <StatCard title="Solicitudes pendientes" value={0} icon={CheckCircle} accent="#D97706" description="Ausencias a revisar" index={3} />
      </div>

      <PlaceholderCard title="Listado de asistencia" />

      {/* Solicitudes de ausencia */}
      <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#B9C0C8" }}>Solicitudes de ausencia pendientes</h2>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "#6B7280" }}>No hay solicitudes pendientes de revisión</p>
        </div>
      </div>
    </div>
  );
}
