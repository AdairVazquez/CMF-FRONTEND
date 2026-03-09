import { BarChart2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function ReportesPage() {
  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Análisis y exportación de datos"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)" }}>
            <BarChart2 className="w-5 h-5" style={{ color: "#059669" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de reportes próximamente disponible
        </p>
      </div>
    </div>
  );
}
