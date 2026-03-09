"use client";

import { Shield, Users, Hash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

interface Role {
  id: number;
  name: string;
  slug: string;
  hierarchy_level: number;
  users_count?: number;
  permissions_count?: number;
}

export default function RolesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => apiClient.get<never, ApiResponse<Role[]>>("/roles"),
  });

  const roles: Role[] = data?.data ?? [];

  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Rol",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}
          >
            <Shield className="w-4 h-4" style={{ color: "#2F80ED" }} />
          </div>
          <div>
            <p className="font-medium" style={{ color: "#F4F6F8" }}>{row.name}</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Badge",
      render: (row) => <RoleBadge role={row.slug} />,
    },
    {
      key: "hierarchy_level",
      header: "Nivel",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5" style={{ color: "#6B7280" }} />
          <span style={{ color: "#B9C0C8" }}>{row.hierarchy_level}</span>
        </div>
      ),
    },
    {
      key: "users_count",
      header: "Usuarios",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" style={{ color: "#6B7280" }} />
          <span style={{ color: "#B9C0C8" }}>{row.users_count ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "permissions_count",
      header: "Permisos",
      render: (row) => (
        <span style={{ color: "#B9C0C8" }}>{row.permissions_count ?? "—"}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Niveles de acceso y permisos del sistema"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <Shield className="w-5 h-5" style={{ color: "#7C3AED" }} />
          </div>
        }
      />
      <DataTable
        columns={columns}
        data={roles}
        keyField="id"
        isLoading={isLoading}
        emptyMessage="No se encontraron roles"
      />
    </div>
  );
}
