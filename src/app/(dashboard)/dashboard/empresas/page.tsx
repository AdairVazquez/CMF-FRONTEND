"use client";

import { useState, useEffect } from "react";
import { Building2, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable"; // Importamos Column para tipado
import { useAuthStore } from "@/store/authStore";

// Definimos la interfaz para que TypeScript no se queje
interface Empresa {
  id: number;
  name: string;
  legal_name: string;
  tax_id: string;
  plan: string;
  status: string;
}

// CORRECCIÓN: Cambiamos 'accessor' por 'key' para que el DataTable lo reconozca
const columns: Column<Empresa>[] = [
  { header: "Nombre", key: "name" },
  { header: "Razón Social", key: "legal_name" },
  { header: "RFC", key: "tax_id" },
  { header: "Plan", key: "plan" },
  { 
    header: "Estado", 
    key: "status",
    render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.status === 'activo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
      }`}>
        {row.status}
      </span>
    )
  },
];

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const cargarEmpresas = async () => {
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
          // Accedemos a result.data.data por la paginación de Laravel
          const dataArray = result.data?.data || [];
          setEmpresas(dataArray);
        }
      } catch (error) {
        console.error("Error cargando empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) cargarEmpresas();
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empresas"
        description="Gestión de entidades registradas en el sistema"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <Building2 className="w-5 h-5" style={{ color: "#2F80ED" }} />
          </div>
        }
      >
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-blue-900/20">
          <Plus className="w-4 h-4" />
          Nueva Empresa
        </button>
      </PageHeader>

      <DataTable 
        columns={columns} 
        data={empresas} 
        keyField="id" // Le decimos que el ID es la llave única
        isLoading={loading}
        emptyMessage="No se encontraron empresas registradas"
      />
    </div>
  );
}