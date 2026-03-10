"use client";

import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Check } from "lucide-react";
import { CmfIcon } from "@/components/shared/CmfIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { VerifyResetCodeResponse } from "@/types/auth";

gsap.registerPlugin(useGSAP);

/* ─── Schemas ─── */
const step1Schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

const step3Schema = z
  .object({
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
type Step3Data = z.infer<typeof step3Schema>;

/* ─── PasswordStrength ─── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Mínimo 8 caracteres",  ok: password.length >= 8 },
    { label: "Una letra mayúscula",  ok: /[A-Z]/.test(password) },
    { label: "Un número",            ok: /[0-9]/.test(password) },
    { label: "Un carácter especial", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;
  const colors   = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels   = ["", "Débil", "Regular", "Buena", "Fuerte"];
  if (!password) return null;

  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i <= strength ? colors[strength] : "#1C2333" }} />
        ))}
      </div>
      <p className="text-xs mb-2" style={{ color: colors[strength] }}>{labels[strength]}</p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: c.ok ? "rgba(34,197,94,0.2)" : "transparent", border: `1px solid ${c.ok ? "#22c55e" : "#1C2333"}` }}
            >
              {c.ok && <Check className="w-2 h-2" style={{ color: "#22c55e" }} />}
            </div>
            <span className="text-xs" style={{ color: c.ok ? "#F4F6F8" : "#6B7280" }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── OTP Inputs ─── */
function OtpInputs({ onComplete, disabled }: { onComplete: (code: string) => void; disabled?: boolean }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) onComplete(next.join(""));
  };
  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length === 6) { setDigits(p.split("")); onComplete(p); }
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Dígito ${i + 1}`}
          className="w-11 h-13 text-center text-lg font-bold font-mono rounded-lg border outline-none transition-all disabled:opacity-50"
          style={{
            background: "#080B0F",
            borderColor: d ? "#2F80ED" : "#1C2333",
            color: "#F4F6F8",
            boxShadow: d ? "0 0 0 1px rgba(47,128,237,0.3)" : "none",
            height: "52px",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = d ? "#2F80ED" : "#1C2333"; e.currentTarget.style.boxShadow = d ? "0 0 0 1px rgba(47,128,237,0.3)" : "none"; }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export function ForgotPasswordForm() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step3Form = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  /* ── GSAP entrada ── */
  useGSAP(() => {
    gsap.fromTo(stepRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [step] });

  const slideToStep = (next: 1 | 2 | 3) => {
    gsap.to(stepRef.current, {
      opacity: 0, x: -30, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setStep(next);
        gsap.fromTo(stepRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }
        );
      },
    });
  };

  /* ── Mutations ── */
  const sendCode = useMutation({
    mutationFn: (d: Step1Data) =>
      apiClient.post<never, ApiResponse<unknown>>("/auth/forgot-password", d),
    onSuccess: (_r, vars) => { setEmail(vars.email); slideToStep(2); },
  });

  const verifyCode = useMutation({
    mutationFn: (code: string) =>
      apiClient.post<never, ApiResponse<VerifyResetCodeResponse>>(
        "/auth/verify-reset-code",
        { email, code }
      ),
    onSuccess: (res) => {
      setResetToken(res.data.reset_token);
      slideToStep(3);
    },
  });

  const resetPassword = useMutation({
    mutationFn: (d: Step3Data) =>
      apiClient.post<never, ApiResponse<unknown>>("/auth/reset-password", {
        reset_token: resetToken,
        password: d.password,
        password_confirmation: d.password_confirmation,
      }),
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      router.push("/login");
    },
  });

  const maskEmail = (e: string) => {
    const [local, domain] = e.split("@");
    if (!local || !domain) return e;
    return `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 3))}@${domain}`;
  };

  /* ── Step indicator ── */
  const steps = [
    { n: 1, label: "Correo" },
    { n: 2, label: "Código" },
    { n: 3, label: "Contraseña" },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0A0D12" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)" }}
          >
            <CmfIcon size={22} color="#F4F6F8" />
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: step > s.n ? "#22c55e" : step === s.n ? "#2F80ED" : "#1C2333",
                    color: step >= s.n ? "#fff" : "#6B7280",
                  }}
                >
                  {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: step === s.n ? "#B9C0C8" : "#6B7280" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-px" style={{ background: step > s.n ? "#22c55e" : "#1C2333" }} />
              )}
            </div>
          ))}
        </div>

        <div
          className="p-8 rounded-2xl border"
          style={{ background: "#0D1117", borderColor: "#1C2333" }}
        >
          <div ref={stepRef}>
            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.3)" }}>
                    <Mail className="w-7 h-7" style={{ color: "#2F80ED" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "#B9C0C8" }}>
                  Recuperar contraseña
                </h2>
                <p className="text-sm text-center mb-1" style={{ color: "#6B7280" }}>
                  Te enviaremos un código de 6 dígitos
                </p>
                <p className="text-xs text-center mb-6" style={{ color: "#6B7280" }}>
                  El código expira en 15 minutos
                </p>
                {sendCode.isError && (
                  <div className="mb-4 px-4 py-3 rounded-lg border text-sm"
                    style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
                    {sendCode.error?.message}
                  </div>
                )}
                <form onSubmit={step1Form.handleSubmit((d) => sendCode.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#B9C0C8" }}>
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step1Form.register("email")}
                        type="email" placeholder="tu@empresa.com"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ background: "#0A0D12", borderColor: step1Form.formState.errors.email ? "#ef4444" : "#1C2333", color: "#F4F6F8" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = step1Form.formState.errors.email ? "#ef4444" : "#1C2333"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>
                    {step1Form.formState.errors.email && (
                      <p className="mt-1 text-xs text-red-400">{step1Form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={sendCode.isPending}
                    className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)", color: "#F4F6F8" }}
                    onMouseEnter={(e) => { if (!sendCode.isPending) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #2F80ED 0%, #0E2F4F 100%)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)"; }}>
                    {sendCode.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</> : "Enviar código"}
                  </button>
                </form>
              </div>
            )}

            {/* ── STEP 2: Verify Code ── */}
            {step === 2 && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(47,128,237,0.1)", border: "1px solid rgba(47,128,237,0.3)" }}>
                    <Mail className="w-7 h-7" style={{ color: "#2F80ED" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "#B9C0C8" }}>
                  Revisa tu correo
                </h2>
                <p className="text-sm text-center mb-1" style={{ color: "#6B7280" }}>
                  Código enviado a{" "}
                  <span style={{ color: "#B9C0C8" }}>{maskEmail(email)}</span>
                </p>
                <p className="text-xs text-center mb-6" style={{ color: "#6B7280" }}>
                  Ingresa el código de 6 dígitos que recibiste
                </p>
                {verifyCode.isError && (
                  <div className="mb-4 px-4 py-3 rounded-lg border text-sm"
                    style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
                    {verifyCode.error?.message}
                  </div>
                )}
                <div className="mb-6">
                  <OtpInputs
                    onComplete={(code) => verifyCode.mutate(code)}
                    disabled={verifyCode.isPending}
                  />
                </div>
                {verifyCode.isPending && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#2F80ED" }} />
                    <span className="text-sm" style={{ color: "#6B7280" }}>Verificando...</span>
                  </div>
                )}
                <button
                  onClick={() => sendCode.mutate({ email })}
                  disabled={sendCode.isPending}
                  className="w-full text-sm py-2 transition-colors hover:text-[#2F80ED] disabled:opacity-50"
                  style={{ color: "#6B7280" }}
                >
                  {sendCode.isPending ? "Reenviando..." : "¿No recibiste el código? Reenviar"}
                </button>
              </div>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <Lock className="w-7 h-7" style={{ color: "#22c55e" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "#B9C0C8" }}>
                  Nueva contraseña
                </h2>
                <p className="text-sm text-center mb-6" style={{ color: "#6B7280" }}>
                  Crea una contraseña segura
                </p>
                {resetPassword.isError && (
                  <div className="mb-4 px-4 py-3 rounded-lg border text-sm"
                    style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
                    {resetPassword.error?.message}
                  </div>
                )}
                <form onSubmit={step3Form.handleSubmit((d) => resetPassword.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#B9C0C8" }}>Nueva contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step3Form.register("password")}
                        type={showPass ? "text" : "password"} placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ background: "#0A0D12", borderColor: step3Form.formState.errors.password ? "#ef4444" : "#1C2333", color: "#F4F6F8" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = step3Form.formState.errors.password ? "#ef4444" : "#1C2333"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Toggle">
                        {showPass ? <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} /> : <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />}
                      </button>
                    </div>
                    <PasswordStrength password={step3Form.watch("password") ?? ""} />
                    {step3Form.formState.errors.password && (
                      <p className="mt-1 text-xs text-red-400">{step3Form.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#B9C0C8" }}>Confirmar contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                      <input
                        {...step3Form.register("password_confirmation")}
                        type={showConfirm ? "text" : "password"} placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ background: "#0A0D12", borderColor: step3Form.formState.errors.password_confirmation ? "#ef4444" : "#1C2333", color: "#F4F6F8" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = step3Form.formState.errors.password_confirmation ? "#ef4444" : "#1C2333"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Toggle">
                        {showConfirm ? <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} /> : <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />}
                      </button>
                    </div>
                    {step3Form.formState.errors.password_confirmation && (
                      <p className="mt-1 text-xs text-red-400">{step3Form.formState.errors.password_confirmation.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={resetPassword.isPending}
                    className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)", color: "#F4F6F8" }}
                    onMouseEnter={(e) => { if (!resetPassword.isPending) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #2F80ED 0%, #0E2F4F 100%)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)"; }}>
                    {resetPassword.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : "Restablecer contraseña"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/login"
              className="flex items-center justify-center gap-2 text-sm transition-colors hover:text-[#2F80ED]"
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
