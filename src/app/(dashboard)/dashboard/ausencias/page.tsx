import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AusenciasPage() {
  return (
    <div>
      <PageHeader
        title="Ausencias"
        description="Solicitudes y aprobaciones de ausencias"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <Calendar className="w-5 h-5" style={{ color: "#f97316" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de ausencias próximamente disponible
        </p>
      </div>
    </div>
  );
}
