"use client";

import { useState } from "react";
import { Shield, QrCode, Key, CheckCircle, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Enable2FAData {
  qr_code: string;
  secret: string;
}

export default function SeguridadPage() {
  const { user } = useAuthStore();
  const [code, setCode] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const { data: setupData, refetch: startSetup, isFetching } = useQuery({
    queryKey: ["2fa-setup"],
    queryFn: () => apiClient.get<never, ApiResponse<Enable2FAData>>("/auth/2fa/enable"),
    enabled: false,
  });

  const confirmMutation = useMutation({
    mutationFn: (code: string) =>
      apiClient.post("/auth/2fa/confirm", { code }),
    onSuccess: () => {
      toast.success("Autenticación 2FA activada correctamente");
      setShowSetup(false);
      setCode("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const disableMutation = useMutation({
    mutationFn: () => apiClient.post("/auth/2fa/disable"),
    onSuccess: () => toast.success("Autenticación 2FA desactivada"),
    onError: (err: Error) => toast.error(err.message),
  });

  const is2FAEnabled = user?.two_factor_enabled && user?.two_factor_confirmed_at;

  const handleStartSetup = async () => {
    setShowSetup(true);
    await startSetup();
  };

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
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <Key className="w-5 h-5" style={{ color: "#7C3AED" }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "#F4F6F8" }}>
                Autenticación de dos factores
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Usa Google Authenticator o Authy
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

        {!is2FAEnabled && !showSetup && (
          <Button
            onClick={handleStartSetup}
            disabled={isFetching}
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            {isFetching ? "Generando..." : "Activar 2FA"}
          </Button>
        )}

        {is2FAEnabled && (
          <Button
            variant="outline"
            onClick={() => disableMutation.mutate()}
            disabled={disableMutation.isPending}
            style={{ borderColor: "#ef4444", color: "#ef4444", background: "transparent" }}
          >
            {disableMutation.isPending ? "Desactivando..." : "Desactivar 2FA"}
          </Button>
        )}

        {showSetup && setupData?.data && (
          <div className="space-y-6 mt-4">
            <div className="space-y-3">
              <p className="text-sm font-medium" style={{ color: "#B9C0C8" }}>
                1. Escanea el código QR con tu app autenticadora
              </p>
              <div
                className="inline-flex p-4 rounded-xl"
                style={{ background: "#fff" }}
                dangerouslySetInnerHTML={{ __html: setupData.data.qr_code }}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: "#B9C0C8" }}>
                O ingresa la clave manualmente:
              </p>
              <code
                className="block px-3 py-2 rounded-lg text-sm font-mono tracking-widest"
                style={{ background: "#080B0F", color: "#2F80ED", border: "1px solid #1C2333" }}
              >
                {setupData.data.secret}
              </code>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: "#B9C0C8" }}>
                2. Ingresa el código de 6 dígitos de tu app para confirmar
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs">
                  <Label htmlFor="confirm-code" className="sr-only">Código 2FA</Label>
                  <Input
                    id="confirm-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center font-mono tracking-[0.5em] text-lg"
                    style={{ background: "#080B0F", borderColor: "#1C2333", color: "#F4F6F8" }}
                  />
                </div>
                <Button
                  onClick={() => confirmMutation.mutate(code)}
                  disabled={code.length < 6 || confirmMutation.isPending}
                  style={{ background: "#7C3AED", color: "#fff" }}
                >
                  {confirmMutation.isPending ? "Verificando..." : "Confirmar"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" style={{ color: "#6B7280" }} />
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Guarda la clave secreta en un lugar seguro. La necesitarás si pierdes acceso a tu app.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
