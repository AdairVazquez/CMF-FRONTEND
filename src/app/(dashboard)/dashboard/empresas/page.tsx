"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, Plus, Pencil, } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { useAuthStore } from "@/store/authStore";
import { ModalNuevaEmpresa } from "./ModalNuevaEmpresa"; // Asegúrate de que la ruta sea correcta
import { Button } from "@/components/ui/button";
import { se } from "date-fns/locale";

interface Empresa {
  id: number;
  name: string;
  legal_name: string;
  tax_id: string;
  plan: string;
  status: string;
}

export default function EmpresasPage() {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | undefined>(undefined);
  const columns: Column<Empresa>[] = [
    { header: "Nombre", key: "name" },
    { header: "Razón Social", key: "legal_name" },
    { header: "RFC", key: "tax_id" },
    { header: "Plan", key: "plan" },
    {
      header: "Estado",
      key: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs capitalize ${row.status === 'activo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
          {row.status}
        </span>

      )
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "#6B7280" }}
            onClick={() => {
              setModo("editar");
              setSelectedEmpresaId(row.id);
              setIsModalOpen(true);
            }}
            aria-label="Editar empresa"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];
  const [modo, setModo] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
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
    <div className="space-y-6">
      <PageHeader
        title="Empresas"
        description="Gestión de entidades registradas en el sistema"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <Building2 className="w-5 h-5" style={{ color: "#2F80ED" }} />
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
            Nueva empresa
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={empresas}
        keyField="id"
        isLoading={loading}
        emptyMessage="No se encontraron empresas registradas"
      />


      {/* Componente Modal */}
      <ModalNuevaEmpresa
        isOpen={isModalOpen}
        mode={modo}
        onClose={() => setIsModalOpen(false)}
        onRefresh={cargarEmpresas}
        empresaId={selectedEmpresaId}
      />
    </div>
  );
}