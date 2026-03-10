"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle, XCircle, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";
import { getRedirectByRole } from "@/types/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SeguridadPage() {
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();
  const [disablePassword, setDisablePassword] = useState("");

  const enableMutation = useMutation({
    mutationFn: () => apiClient.post<never, ApiResponse<never>>("/auth/two-factor/enable"),
    onSuccess: () => {
      toast.success("2FA activado correctamente.");
      if (user && token) {
        const updatedUser = { ...user, two_factor_enabled: true, two_factor_confirmed_at: new Date().toISOString() } as typeof user;
        setAuth(updatedUser, token);
        router.push(getRedirectByRole(updatedUser));
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const disableMutation = useMutation({
    mutationFn: () => apiClient.post<never, ApiResponse<never>>("/auth/two-factor/disable", { password: disablePassword }),
    onSuccess: () => {
      toast.success("Autenticación 2FA desactivada.");
      setDisablePassword("");
      if (user && token) {
        setAuth({ ...user, two_factor_enabled: false, two_factor_confirmed_at: null } as typeof user, token);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const is2FAEnabled = user?.two_factor_enabled && user?.two_factor_confirmed_at;

  return (
    <div>
      <PageHeader
        title="Seguridad"
        description="Configuración de autenticación de dos factores"
        iconNode={
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <Shield className="w-5 h-5" style={{ color: "#7C3AED" }} />
          </div>
        }
      />

      <div
        className="p-6 rounded-xl border max-w-2xl"
        style={{ background: "#0D1117", borderColor: "#1C2333" }}
      >
        {/* Estado actual */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <Mail className="w-5 h-5" style={{ color: "#7C3AED" }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "#F4F6F8" }}>
                Autenticación de dos factores
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Al iniciar sesión recibirás un código de verificación en tu correo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {is2FAEnabled ? (
              <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
            ) : (
              <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />
            )}
            <span
              className="text-sm font-medium"
              style={{ color: is2FAEnabled ? "#22c55e" : "#ef4444" }}
            >
              {is2FAEnabled ? "Activado" : "Desactivado"}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div
          className="p-4 rounded-lg mb-6 text-sm"
          style={{ background: "#080B0F", border: "1px solid #1C2333", color: "#6B7280" }}
        >
          {is2FAEnabled ? (
            <p>Cada vez que inicies sesión, enviaremos un código de 6 dígitos a <strong style={{ color: "#B9C0C8" }}>{user?.email}</strong>. Deberás ingresarlo para acceder.</p>
          ) : (
            <p>Activa el 2FA para agregar una capa extra de seguridad. Al iniciar sesión recibirás un código por correo electrónico en <strong style={{ color: "#B9C0C8" }}>{user?.email}</strong>.</p>
          )}
        </div>

        {/* Acción */}
        {is2FAEnabled ? (
          <div className="space-y-3">
            <div className="space-y-1.5 max-w-xs">
              <Label style={{ color: "#B9C0C8" }}>Confirma tu contraseña para desactivar</Label>
              <Input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Tu contraseña actual"
                style={{ background: "#080B0F", borderColor: "#1C2333", color: "#F4F6F8" }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => disableMutation.mutate()}
              disabled={disableMutation.isPending || !disablePassword}
              style={{ borderColor: "#ef4444", color: "#ef4444", background: "transparent" }}
            >
              {disableMutation.isPending ? "Desactivando..." : "Desactivar 2FA"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => enableMutation.mutate()}
            disabled={enableMutation.isPending}
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            {enableMutation.isPending ? "Activando..." : "Activar 2FA"}
          </Button>
        )}
      </div>
    </div>
  );
}
