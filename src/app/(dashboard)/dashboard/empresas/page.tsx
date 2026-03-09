import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function EmpresasPage() {
  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Gestión de empresas del sistema SaaS"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <Building2 className="w-5 h-5" style={{ color: "#7C3AED" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de empresas próximamente disponible
        </p>
      </div>
    </div>
  );
}
