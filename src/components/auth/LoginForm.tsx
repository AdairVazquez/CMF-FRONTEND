"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Mail, Lock, Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";

gsap.registerPlugin(useGSAP);

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const TEST_USERS = [
  { email: "joshuapaz24@gmail.com",       password: "CMF@2026!", role: "Super Admin"  },
  { email: "Adairvazquezcr@gmail.com",    password: "CMF@2026!", role: "Director"     },
  { email: "chrisaban08@gmail.com",       password: "CMF@2026!", role: "RH"           },
  { email: "joshuapaz2412@gmail.com",     password: "CMF@2026!", role: "Jefe de Área" },
  { email: "joshuapaz1224@gmail.com",     password: "CMF@2026!", role: "Operador"     },
];

export function LoginForm() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const leftRef       = useRef<HTMLDivElement>(null);
  const formRef       = useRef<HTMLDivElement>(null);
  const [showPass, setShowPass]       = useState(false);
  const [credsOpen, setCredsOpen]     = useState(false);
  const login = useLogin();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /* ── GSAP entrada ── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(leftRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.7 }
    ).fromTo(".login-left-item",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      "-=0.3"
    ).fromTo(formRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6 },
      "-=0.5"
    );
  }, { scope: containerRef });

  const onSubmit = (data: LoginFormData) => { login.mutate(data); };

  const fillCreds = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    setCredsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex"
      style={{ background: "#0A0D12" }}
    >
      {/* ────────────── LEFT ────────────── */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden"
      >
        {/* Mesh gradient hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(14,47,79,0.35) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(47,128,237,0.08) 0%, transparent 50%),
              #0A0D12
            `,
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2F80ED" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 login-left-item">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)", color: "#F4F6F8" }}
            >
              CMF
            </div>
            <span
              className="text-xl font-semibold text-gradient-silver"
              style={{
                background: "linear-gradient(135deg, #B9C0C8 0%, #F4F6F8 40%, #B9C0C8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Control Laboral
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="login-left-item">
            <h1
              className="text-5xl font-bold leading-tight"
              style={{
                background: "linear-gradient(135deg, #B9C0C8 0%, #F4F6F8 40%, #B9C0C8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Control total de tu fuerza laboral
            </h1>
          </div>

          <p className="text-lg max-w-md login-left-item" style={{ color: "#6B7280" }}>
            Monitorea asistencia, gestiona empleados y controla dispositivos
            NFC desde un solo lugar.
          </p>

          {/* Stats */}
          <div className="flex gap-10 login-left-item">
            {[
              { value: "99.9%",   label: "Disponibilidad" },
              { value: "<1s",     label: "Tiempo de respuesta" },
              { value: "256-bit", label: "Encriptación" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl font-bold font-mono"
                  style={{ color: "#2F80ED" }}
                >
                  {s.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credenciales */}
        <div className="relative z-10 login-left-item">
          <button
            onClick={() => setCredsOpen(!credsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors"
            style={{ background: "#0D1117", borderColor: "#1C2333", color: "#6B7280" }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase">
              Credenciales de prueba
            </span>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{ transform: credsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          {credsOpen && (
            <div
              className="mt-1 rounded-lg border overflow-hidden"
              style={{ background: "#0A0D12", borderColor: "#1C2333" }}
            >
              {TEST_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => fillCreds(u.email, u.password)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="text-xs font-mono" style={{ color: "#B9C0C8" }}>{u.email}</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>{u.role}</p>
                  </div>
                  <span className="text-xs font-mono" style={{ color: "#1C2333" }}>
                    password
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ────────────── RIGHT ────────────── */}
      <div
        ref={formRef}
        className="flex-1 flex items-center justify-center p-8 relative"
      >
        {/* Left gradient border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #2F80ED 30%, #0E2F4F 70%, transparent 100%)",
          }}
        />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)", color: "#F4F6F8" }}
            >
              CMF
            </div>
            <span className="font-semibold" style={{ color: "#B9C0C8" }}>Control Laboral</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#B9C0C8" }}>
              Bienvenido de vuelta
            </h2>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Error */}
          {login.error && (
            <div
              className="mb-5 px-4 py-3 rounded-lg border text-sm"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}
            >
              {login.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#B9C0C8" }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="tu@empresa.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus-ring"
                  style={{
                    background: "#0A0D12",
                    borderColor: errors.email ? "#ef4444" : "#1C2333",
                    color: "#F4F6F8",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#1C2333"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#B9C0C8" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all"
                  style={{
                    background: "#0A0D12",
                    borderColor: errors.password ? "#ef4444" : "#1C2333",
                    color: "#F4F6F8",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.password ? "#ef4444" : "#1C2333"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPass ? "Ocultar" : "Mostrar"}
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} />
                    : <Eye    className="w-4 h-4" style={{ color: "#6B7280" }} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm transition-colors hover:text-[#2F80ED]"
                style={{ color: "#6B7280" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)", color: "#F4F6F8" }}
              onMouseEnter={(e) => { if (!login.isPending) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #2F80ED 0%, #0E2F4F 100%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)"; }}
            >
              {login.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Iniciando sesión...</>
                : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
