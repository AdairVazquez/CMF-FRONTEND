import { Monitor } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function DispositivosPage() {
  return (
    <div>
      <PageHeader
        title="Dispositivos"
        description="Lectores NFC y su estado en tiempo real"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <Monitor className="w-5 h-5" style={{ color: "#a855f7" }} />
          </div>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de dispositivos próximamente disponible
        </p>
      </div>
    </div>
  );
}
