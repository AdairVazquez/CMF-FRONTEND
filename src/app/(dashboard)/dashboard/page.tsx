"use client";

import { Users, Clock, Monitor, Activity, Building2, Server, Database } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { getGreeting, getUserRole } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

interface HealthData {
  status: string;
  services: Record<string, { status: string; driver?: string; response_ms?: number }>;
}

function SuperAdminDashboard() {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.get<never, ApiResponse<HealthData>>("/system/health"),
    refetchInterval: 30000,
  });

  const services = health?.data?.services ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Empresas activas"    value={2}   icon={Building2} accent="#7C3AED" index={0} />
        <StatCard title="Usuarios totales"    value={5}   icon={Users}     accent="#2F80ED" index={1} />
        <StatCard title="Empleados totales"   value={10}  icon={Activity}  accent="#059669" index={2} />
        <StatCard title="Dispositivos NFC"    value={3}   icon={Monitor}   accent="#D97706" index={3} />
      </div>

      {/* Health */}
      <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-5 h-5" style={{ color: "#2F80ED" }} />
          <h2 className="text-base font-semibold" style={{ color: "#B9C0C8" }}>Estado del sistema</h2>
          <span
            className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: health?.data?.status === "healthy" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color:      health?.data?.status === "healthy" ? "#22c55e"              : "#ef4444",
            }}
          >
            {health?.data?.status === "healthy" ? "Saludable" : health?.data?.status ?? "Cargando..."}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(services).map(([key, svc]) => (
            <div key={key} className="p-3 rounded-lg border" style={{ background: "#080B0F", borderColor: "#1C2333" }}>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: svc.status === "online" ? "#22c55e" : "#ef4444" }}
                />
                <span className="text-xs font-medium capitalize" style={{ color: "#B9C0C8" }}>{key}</span>
              </div>
              {svc.driver && <p className="text-xs" style={{ color: "#6B7280" }}>{svc.driver}</p>}
              {svc.response_ms !== undefined && (
                <p className="text-xs" style={{ color: "#6B7280" }}>{svc.response_ms}ms</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DirectorDashboard({ name, company }: { name: string; company?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#B9C0C8" }}>{getGreeting(name)}</h1>
        {company && <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{company}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Empleados presentes" value={0}  icon={Users}    accent="#2F80ED" description="Asistencia de hoy"    index={0} />
        <StatCard title="Registros de hoy"    value={0}  icon={Clock}    accent="#22c55e" description="Entradas y salidas"  index={1} />
        <StatCard title="Retardos del día"    value={0}  icon={Activity} accent="#f97316" description="Llegadas tarde"      index={2} />
        <StatCard title="Dispositivos activos" value={0} icon={Monitor}  accent="#a855f7" description="Lectores en línea"   index={3} />
      </div>
      <PlaceholderCard title="Actividad reciente" />
    </div>
  );
}

function OperadorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#B9C0C8" }}>Panel de Operador</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Estado de dispositivos y registros NFC</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Dispositivos en línea"  value={0} icon={Monitor}  accent="#22c55e" index={0} />
        <StatCard title="Registros de hoy"       value={0} icon={Database} accent="#2F80ED" index={1} />
        <StatCard title="Dispositivos offline"   value={0} icon={Server}   accent="#ef4444" index={2} />
      </div>
      <PlaceholderCard title="Últimos registros NFC" />
    </div>
  );
}

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
  const { user } = useAuthStore();
  const role     = user ? getUserRole(user) : "operador";

  if (role === "super_admin") return <SuperAdminDashboard />;
  if (role === "operador")    return <OperadorDashboard />;
  return (
    <DirectorDashboard
      name={user?.name ?? ""}
      company={user?.company?.name}
    />
  );
}
