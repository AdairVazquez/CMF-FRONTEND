"use client";

import { useEffect, useState } from "react";
import { Monitor, Database, Server, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { getGreeting } from "@/lib/utils";
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

export default function DispositivosPage() {
  const { user } = useAuthStore();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(format(new Date(), "HH:mm:ss", { locale: es }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

      <PageHeader
        title="Dispositivos NFC"
        description="Estado de lectores y últimos registros del sistema"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <Monitor className="w-5 h-5" style={{ color: "#a855f7" }} />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Dispositivos en línea"  value={0} icon={Monitor}  accent="#22c55e" description="Conectados ahora" index={0} />
        <StatCard title="Registros de hoy"        value={0} icon={Database} accent="#2F80ED" description="Lecturas NFC"     index={1} />
        <StatCard title="Dispositivos offline"    value={0} icon={Server}   accent="#ef4444" description="Sin conexión"     index={2} />
      </div>

      {/* Grid de dispositivos */}
      <div className="p-6 rounded-xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#B9C0C8" }}>Estado de dispositivos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border" style={{ background: "#080B0F", borderColor: "#1C2333" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span className="text-sm font-medium" style={{ color: "#B9C0C8" }}>Lector NFC {i}</span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(107,114,128,0.1)", color: "#6B7280", border: "1px solid rgba(107,114,128,0.2)" }}
                >
                  Sin datos
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" style={{ color: "#6B7280" }} />
                <span className="text-xs" style={{ color: "#6B7280" }}>Esperando conexión...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PlaceholderCard title="Últimos 10 registros NFC" />
    </div>
  );
}
