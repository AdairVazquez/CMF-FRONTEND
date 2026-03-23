"use client";

import { useState } from "react";
import { UserCog, Plus, Search, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserRole } from "@/lib/utils";

interface UsersResponse {
  data: User[];
  meta: { current_page: number; total: number; per_page: number };
}

export default function UsuariosPage() {
  const qc = useQueryClient();
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page]                  = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () =>
      apiClient.get<never, ApiResponse<UsersResponse>>("/users", {
        params: { page, search: search || undefined },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente");
      qc.invalidateQueries({ queryKey: ["users"] });
      setDeleteId(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const users: User[] = data?.data?.data ?? [];
  const total: number = data?.data?.meta?.total ?? 0;

  const filtered = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Nombre",
      render: (row) => (
        <div>
          <p className="font-medium" style={{ color: "#F4F6F8" }}>{row.name}</p>
          <p className="text-xs" style={{ color: "#6B7280" }}>{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol",
      render: (row) => <RoleBadge role={getUserRole(row)} />,
    },
    {
      key: "company",
      header: "Empresa",
      render: (row) => (
        <span style={{ color: "#6B7280" }}>{row.company?.name ?? "—"}</span>
      ),
    },
    {
      key: "is_active",
      header: "Estado",
      render: (row) => (
        <span
          className="text-xs px-2 py-0.5 rounded-full border font-medium"
          style={
            row.is_active
              ? { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" }
              : { background: "rgba(239,68,68,0.1)",  color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }
          }
        >
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "two_factor_enabled",
      header: "2FA",
      render: (row) => (
        <span style={{ color: row.two_factor_enabled ? "#22c55e" : "#6B7280", fontSize: 12 }}>
          {row.two_factor_enabled ? "Activado" : "Desactivado"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "#6B7280" }}
            onClick={() => toast.info("Edición próximamente disponible")}
            aria-label="Editar usuario"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-red-950/30"
            style={{ color: "#6B7280" }}
            onClick={() => setDeleteId(row.id)}
            aria-label="Eliminar usuario"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description={`${total} usuarios en el sistema`}
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <UserCog className="w-5 h-5" style={{ color: "#2F80ED" }} />
          </div>
        }
        actions={
          <Button
            size="sm"
            className="gap-2"
            style={{ background: "#2F80ED", color: "#fff" }}
            onClick={() => toast.info("Creación de usuarios próximamente")}
          >
            <Plus className="w-4 h-4" />
            Nuevo usuario
          </Button>
        } 
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#6B7280" }}
          />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
            style={{ background: "#0D1117", borderColor: "#1C2333", color: "#B9C0C8" }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          style={{ background: "transparent", borderColor: "#1C2333", color: "#6B7280" }}
          onClick={() => refetch()}
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
      />

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent style={{ background: "#0D1117", border: "1px solid #1C2333" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#F4F6F8" }}>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="text-sm mb-4" style={{ color: "#B9C0C8" }}>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              style={{ borderColor: "#1C2333", color: "#B9C0C8", background: "transparent" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
