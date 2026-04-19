import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Pencil, } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";

interface Empleado {
  id: number;
  name: string;
  legal_name: string;
  tax_id: string;
  plan: string;
  status: string;
  disabled_at: string;
}



export default function EmpleadosPage() {

    const [modo, setModo] = useState("");
    const [empresas, setEmpresas] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
    const { token } = useAuthStore();
    // Envolvemos la carga en useCallback para poder pasarla al modal y refrescar
    const cargarEmpresas = useCallback(async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/companies", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          // Ajustado para la estructura típica de paginación de Laravel (result.data.data)
          const dataArray = result.data?.data || result.data || [];
          setEmpresas(dataArray);
        }
      } catch (error) {
        console.error("Error cargando empresas:", error);
      } finally {
        setLoading(false);
      }
    }, [token]);
  
    useEffect(() => {
      cargarEmpresas();
    }, [cargarEmpresas]);

  return (
    <div>
      <PageHeader
        title="Empleados"
        description="Gestión del personal de la empresa"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <Users className="w-5 h-5" style={{ color: "#2F80ED" }} />
          </div>
        }
        actions={
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setIsModalOpen(true);
              setModo("crear");
            }}
            style={{ background: "#2F80ED", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            Nuevo empleado
          </Button>
        }
      />
      <div
        className="p-6 rounded-xl border flex items-center justify-center h-64"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Módulo de empleados próximamente disponible
        </p>
      </div>
    </div>

    // {/* Componente Modal */}
    //       <ModalNuevoEmpleado
    //         isOpen={isModalOpen}
    //         mode={modo}
    //         onClose={() => setIsModalOpen(false)}
    //         onRefresh={cargarEmpleados}
    //         empresaId={selectedEmpleadoId}
    //       />
    //     </div>
  );
}
