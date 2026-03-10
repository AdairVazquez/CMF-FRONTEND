"use client";

import { useEffect, useState } from "react";
import { Users, Monitor, Building2, Activity, Server, Database, RefreshCw, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { getGreeting } from "@/lib/utils";
import { axiosPublic } from "@/lib/axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ServiceStatus {
  status: string;
  driver?: string;
  response_ms?: number;
}

interface HealthData {
  status: string;
  uptime?: number;
  services?: Record<string, ServiceStatus>;
}

function formatUptime(seconds?: number): string {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d} días, ${h} horas, ${m} minutos`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    healthy:  { label: "● Saludable",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    degraded: { label: "● Degradado",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    critical: { label: "● Crítico",    color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const s = map[status] ?? { label: `● ${status}`, color: "#6B7280", bg: "rgba(107,114,128,0.1)" };
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function SuperDashboardPage() {
  const { user } = useAuthStore();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [clock, setClock] = useState("");

  const fetchHealth = async () => {
    try {
      const res = await axiosPublic.get<never, { data: HealthData }>("/system/health");
      setHealth(res.data ?? res as unknown as HealthData);
      setHealthError(false);
    } catch {
      setHealthError(true);
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => setClock(format(new Date(), "HH:mm:ss", { locale: es }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });
  const services = health?.services ?? {};
  const effectiveStatus = healthError ? "critical" : (health?.status ?? "healthy");

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
        <StatCard title="Empresas activas"  value={2}  icon={Building2} accent="#7C3AED" index={0} />
        <StatCard title="Usuarios totales"  value={5}  icon={Users}     accent="#2F80ED" index={1} />
        <StatCard title="Empleados totales" value={10} icon={Activity}  accent="#059669" index={2} />
        <StatCard title="Dispositivos NFC"  value={3}  icon={Monitor}   accent="#D97706" index={3} />
      </div>

      {/* Estado del Sistema */}
      <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}
            >
              <Server className="w-5 h-5" style={{ color: "#2F80ED" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "#B9C0C8" }}>Estado del Sistema</h2>
              {lastCheck && (
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Última verificación: {format(lastCheck, "HH:mm:ss")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={effectiveStatus} />
            <button
              onClick={fetchHealth}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ color: "#6B7280" }}
              title="Actualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {health?.uptime !== undefined && (
          <div className="mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: "#6B7280" }} />
            <span className="text-sm" style={{ color: "#6B7280" }}>
              Uptime: <span style={{ color: "#B9C0C8" }}>{formatUptime(health.uptime)}</span>
            </span>
          </div>
        )}

        {healthError ? (
          <div
            className="p-4 rounded-lg border text-sm"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            No se pudo obtener el estado del sistema. Verifica la conexión con el servidor.
          </div>
        ) : Object.keys(services).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(services).map(([key, svc]) => (
              <div key={key} className="p-4 rounded-lg border" style={{ background: "#080B0F", borderColor: "#1C2333" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: svc.status === "online" || svc.status === "healthy" ? "#22c55e" : "#ef4444" }}
                  />
                  <span className="text-sm font-medium capitalize" style={{ color: "#B9C0C8" }}>{key}</span>
                </div>
                {svc.driver && (
                  <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                    Driver: {svc.driver}
                  </p>
                )}
                {svc.response_ms !== undefined && (
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Latencia: <span style={{ color: svc.response_ms < 100 ? "#22c55e" : svc.response_ms < 500 ? "#f59e0b" : "#ef4444" }}>{svc.response_ms}ms</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["Base de datos", "Cache", "Cola"].map((name) => (
              <div key={name} className="p-4 rounded-lg border" style={{ background: "#080B0F", borderColor: "#1C2333" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span className="text-sm font-medium" style={{ color: "#B9C0C8" }}>{name}</span>
                </div>
                <p className="text-xs" style={{ color: "#6B7280" }}>Verificando...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auditoría placeholder */}
      <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#B9C0C8" }}>Auditoría de Logs</h2>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Historial de actividad disponible próximamente
          </p>
        </div>
      </div>
    </div>
  );
}
