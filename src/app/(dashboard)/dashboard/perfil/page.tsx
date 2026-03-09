"use client";

import { User, Mail, Phone, Building2, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { getUserRole } from "@/lib/utils";

export default function PerfilPage() {
  const { user } = useAuthStore();
  const role = user ? getUserRole(user) : "operador";

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        description="Información de tu cuenta"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.2)" }}>
            <User className="w-5 h-5" style={{ color: "#2F80ED" }} />
          </div>
        }
      />

      <div className="max-w-2xl space-y-4">
        {/* Avatar */}
        <div
          className="p-6 rounded-xl border flex items-center gap-5"
          style={{ background: "#0D1117", borderColor: "#1C2333" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ background: getAvatarColor(role), color: "#fff" }}
          >
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#F4F6F8" }}>{user.name}</h2>
            <p className="text-sm mb-2" style={{ color: "#6B7280" }}>{user.email}</p>
            <RoleBadge role={role} />
          </div>
        </div>

        {/* Details */}
        <div
          className="p-6 rounded-xl border space-y-4"
          style={{ background: "#0D1117", borderColor: "#1C2333" }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B9C0C8" }}>
            Información de la cuenta
          </h3>
          <div className="space-y-3">
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Phone} label="Teléfono" value={user.phone ?? "No registrado"} />
            {user.company && (
              <InfoRow icon={Building2} label="Empresa" value={user.company.name} />
            )}
            <InfoRow
              icon={Shield}
              label="Autenticación 2FA"
              value={user.two_factor_enabled && user.two_factor_confirmed_at ? "Activada" : "Desactivada"}
              valueColor={user.two_factor_enabled ? "#22c55e" : "#ef4444"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueColor = "#B9C0C8",
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "#080B0F", border: "1px solid #1C2333" }}
      >
        <Icon className="w-4 h-4" style={{ color: "#6B7280" }} />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm" style={{ color: "#6B7280" }}>{label}</span>
        <span className="text-sm font-medium" style={{ color: valueColor }}>{value}</span>
      </div>
    </div>
  );
}

function getAvatarColor(role: string): string {
  const map: Record<string, string> = {
    super_admin: "#7C3AED",
    director:    "#2F80ED",
    rh:          "#059669",
    jefe_area:   "#D97706",
    operador:    "#6B7280",
  };
  return map[role] ?? "#6B7280";
}
