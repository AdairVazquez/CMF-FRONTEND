"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";
import { Logo } from "@/components/shared/Logo";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#0A0D12" }}>
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[60%] p-12 relative overflow-hidden"
        style={{ background: "#080B0F" }}
      >
        {/* Geometric pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5" viewBox="0 0 600 600">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2F80ED" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#grid)" />
          </svg>
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #2F80ED, transparent)" }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #0E2F4F, transparent)" }} />
        </div>

        <Logo size="lg" />

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight mb-6"
            style={{ color: "#B9C0C8" }}
          >
            Control total de tu{" "}
            <span style={{ color: "#2F80ED" }}>fuerza laboral</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg max-w-md"
            style={{ color: "#6B7280" }}
          >
            Monitorea asistencia, gestiona empleados y controla dispositivos NFC
            desde un solo lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex gap-8"
          >
            {[
              { number: "99.9%", label: "Uptime" },
              { number: "< 1s", label: "Respuesta" },
              { number: "256-bit", label: "Cifrado" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold" style={{ color: "#2F80ED" }}>
                  {stat.number}
                </div>
                <div className="text-sm" style={{ color: "#6B7280" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 p-4 rounded-lg border"
          style={{ borderColor: "#1C2333", background: "#0D1117" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>
            CREDENCIALES DE PRUEBA
          </p>
          <div className="space-y-1 font-mono text-sm">
            <p style={{ color: "#B9C0C8" }}>director@hospital.com / password</p>
            <p style={{ color: "#B9C0C8" }}>super@saas.com / password</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div
            className="p-8 rounded-2xl border"
            style={{ background: "#0D1117", borderColor: "#1C2333" }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#B9C0C8" }}>
              Iniciar sesión
            </h2>
            <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
              Ingresa tus credenciales para acceder al sistema
            </p>

            {login.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg border border-red-800 bg-red-950/50"
              >
                <p className="text-sm text-red-400">
                  {login.error.message}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#F4F6F8" }}
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#6B7280" }}
                  />
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-label="Correo electrónico"
                    placeholder="tu@empresa.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#2F80ED]"
                    style={{
                      background: "#080B0F",
                      borderColor: errors.email ? "#ef4444" : "#1C2333",
                      color: "#F4F6F8",
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#F4F6F8" }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#6B7280" }}
                  />
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-label="Contraseña"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#2F80ED]"
                    style={{
                      background: "#080B0F",
                      borderColor: errors.password ? "#ef4444" : "#1C2333",
                      color: "#F4F6F8",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" style={{ color: "#6B7280" }} />
                    ) : (
                      <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm transition-colors hover:text-[#2F80ED]"
                  style={{ color: "#6B7280" }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: login.isPending ? "#0E2F4F" : "#0E2F4F",
                  color: "#F4F6F8",
                }}
                onMouseEnter={(e) => {
                  if (!login.isPending) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#2F80ED";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#0E2F4F";
                }}
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
