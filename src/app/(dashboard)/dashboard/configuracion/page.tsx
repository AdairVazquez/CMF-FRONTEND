import { Settings } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function ConfiguracionPage() {
  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Ajustes generales del sistema"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(107,114,128,0.1)", border: "1px solid rgba(107,114,128,0.2)" }}>
            <Settings className="w-5 h-5" style={{ color: "#6B7280" }} />
          </div>
        }
      />
      <div className="p-6 rounded-xl border flex items-center justify-center h-64" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <p className="text-sm" style={{ color: "#6B7280" }}>Módulo de configuración próximamente disponible</p>
      </div>
    </div>
  );
}
