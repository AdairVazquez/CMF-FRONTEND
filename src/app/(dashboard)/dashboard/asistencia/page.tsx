import { Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AsistenciaPage() {
  return (
    <div>
      <PageHeader
        title="Asistencia"
        description="Registros de entrada y salida del personal"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Clock className="w-5 h-5" style={{ color: "#22c55e" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de asistencia próximamente disponible
        </p>
      </div>
    </div>
  );
}
