import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function TarjetasPage() {
  return (
    <div>
      <PageHeader
        title="Tarjetas NFC"
        description="Gestión de tarjetas de acceso"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}>
            <CreditCard className="w-5 h-5" style={{ color: "#D97706" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de tarjetas NFC próximamente disponible
        </p>
      </div>
    </div>
  );
}
