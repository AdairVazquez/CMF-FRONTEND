import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Análisis avanzado de datos de asistencia y productividad"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "#2F80ED" }} />
          </div>
        }
      />
      <div className="p-6 rounded-xl border flex items-center justify-center h-64" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
        <p className="text-sm" style={{ color: "#6B7280" }}>Módulo de analytics próximamente disponible</p>
      </div>
    </div>
  );
}
