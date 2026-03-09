"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Key, Lock, Eye, EyeOff, Loader2, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Logo } from "@/components/shared/Logo";
import type { ApiResponse } from "@/types/api";

const step1Schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

const step2Schema = z
  .object({
    code: z.string().length(6, "El código debe tener 6 dígitos"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
    { label: "Carácter especial", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["", "Muy débil", "Débil", "Regular", "Fuerte"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i <= strength ? colors[strength] : "#1C2333" }}
          />
        ))}
      </div>
      <p className="text-xs mb-2" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1">
            <Check className="w-3 h-3" style={{ color: c.ok ? "#22c55e" : "#1C2333" }} />
            <span className="text-xs" style={{ color: c.ok ? "#F4F6F8" : "#6B7280" }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

  const sendCode = useMutation({
    mutationFn: (data: Step1Data) =>
      apiClient.post<never, ApiResponse<unknown>>("/auth/forgot-password", data),
    onSuccess: (_res, variables) => {
      setEmail(variables.email);
      setStep(2);
    },
  });

  const resetPassword = useMutation({
    mutationFn: (data: Step2Data) =>
      apiClient.post<never, ApiResponse<unknown>>("/auth/reset-password", {
        ...data,
        email,
      }),
    onSuccess: () => setSuccess(true),
  });

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0A0D12" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md p-8 rounded-2xl border text-center"
          style={{ background: "#0D1117", borderColor: "#1C2333" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#B9C0C8" }}>¡Contraseña restablecida!</h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Tu contraseña ha sido actualizada correctamente.</p>
          <Link href="/login"
            className="block w-full py-3 px-4 rounded-lg font-medium text-sm text-center transition-all"
            style={{ background: "#0E2F4F", color: "#F4F6F8" }}>
            Ir al inicio de sesión
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0A0D12" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="p-8 rounded-2xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(47, 128, 237, 0.1)", border: "1px solid rgba(47, 128, 237, 0.3)" }}>
                    <Mail className="w-8 h-8" style={{ color: "#2F80ED" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#B9C0C8" }}>
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-sm text-center mb-2" style={{ color: "#6B7280" }}>
                  Te enviaremos un código de 6 dígitos que expira en 15 minutos
                </p>

                {sendCode.error && (
                  <div className="mb-4 p-3 rounded-lg border border-red-800 bg-red-950/50">
                    <p className="text-sm text-red-400">{sendCode.error.message}</p>
                  </div>
                )}

                <form onSubmit={step1Form.handleSubmit((d) => sendCode.mutate(d))} className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium mb-2" style={{ color: "#F4F6F8" }}>
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step1Form.register("email")}
                        id="forgot-email"
                        type="email"
                        placeholder="tu@empresa.com"
                        aria-label="Correo electrónico"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#2F80ED]"
                        style={{ background: "#080B0F", borderColor: step1Form.formState.errors.email ? "#ef4444" : "#1C2333", color: "#F4F6F8" }}
                      />
                    </div>
                    {step1Form.formState.errors.email && (
                      <p className="mt-1 text-xs text-red-400">{step1Form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={sendCode.isPending}
                    className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ background: "#0E2F4F", color: "#F4F6F8" }}>
                    {sendCode.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</> : "Enviar código"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(47, 128, 237, 0.1)", border: "1px solid rgba(47, 128, 237, 0.3)" }}>
                    <Key className="w-8 h-8" style={{ color: "#2F80ED" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#B9C0C8" }}>
                  Restablecer contraseña
                </h2>
                <p className="text-sm text-center mb-6" style={{ color: "#6B7280" }}>
                  Código enviado a <span style={{ color: "#B9C0C8" }}>{email}</span>
                </p>

                {resetPassword.error && (
                  <div className="mb-4 p-3 rounded-lg border border-red-800 bg-red-950/50">
                    <p className="text-sm text-red-400">{resetPassword.error.message}</p>
                  </div>
                )}

                <form onSubmit={step2Form.handleSubmit((d) => resetPassword.mutate(d))} className="space-y-4">
                  <div>
                    <label htmlFor="reset-code" className="block text-sm font-medium mb-2" style={{ color: "#F4F6F8" }}>Código de verificación</label>
                    <input
                      {...step2Form.register("code")}
                      id="reset-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      aria-label="Código de verificación"
                      className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all text-center tracking-widest font-mono"
                      style={{ background: "#080B0F", borderColor: "#1C2333", color: "#F4F6F8" }}
                    />
                    {step2Form.formState.errors.code && (
                      <p className="mt-1 text-xs text-red-400">{step2Form.formState.errors.code.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium mb-2" style={{ color: "#F4F6F8" }}>Nueva contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step2Form.register("password")}
                        id="new-password"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        aria-label="Nueva contraseña"
                        className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ background: "#080B0F", borderColor: "#1C2333", color: "#F4F6F8" }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Toggle password">
                        {showPass ? <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} /> : <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />}
                      </button>
                    </div>
                    <PasswordStrength password={step2Form.watch("password") ?? ""} />
                    {step2Form.formState.errors.password && (
                      <p className="mt-1 text-xs text-red-400">{step2Form.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-2" style={{ color: "#F4F6F8" }}>Confirmar contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step2Form.register("password_confirmation")}
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        aria-label="Confirmar contraseña"
                        className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ background: "#080B0F", borderColor: "#1C2333", color: "#F4F6F8" }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Toggle confirm password">
                        {showConfirm ? <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} /> : <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />}
                      </button>
                    </div>
                    {step2Form.formState.errors.password_confirmation && (
                      <p className="mt-1 text-xs text-red-400">{step2Form.formState.errors.password_confirmation.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={resetPassword.isPending}
                    className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ background: "#0E2F4F", color: "#F4F6F8" }}>
                    {resetPassword.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Restableciendo...</> : "Restablecer contraseña"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm transition-colors hover:text-[#2F80ED]"
              style={{ color: "#6B7280" }}>
              <ArrowLeft className="w-3 h-3" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
