"use client";

import { useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useVerify2FA } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { Logo } from "@/components/shared/Logo";

export function TwoFactorForm() {
  const router = useRouter();
  const { twoFactorToken } = useAuthStore();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verify = useVerify2FA();

  useEffect(() => {
    if (!twoFactorToken) {
      router.push("/login");
    }
  }, [twoFactorToken, router]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every((d) => d !== "") && newCode.join("").length === 6) {
      verify.mutate(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      verify.mutate(pasted);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "#0A0D12" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="p-8 rounded-2xl border" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(47, 128, 237, 0.1)", border: "1px solid rgba(47, 128, 237, 0.3)" }}>
              <Shield className="w-8 h-8" style={{ color: "#2F80ED" }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#B9C0C8" }}>
            Verificación en dos pasos
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "#6B7280" }}>
            Ingresa el código de tu app autenticadora
          </p>

          {verify.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg border border-red-800 bg-red-950/50"
            >
              <p className="text-sm text-red-400 text-center">{verify.error.message}</p>
            </motion.div>
          )}

          <div className="flex gap-3 justify-center mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={verify.isPending}
                aria-label={`Dígito ${index + 1} del código`}
                className="w-12 h-14 text-center text-xl font-bold rounded-lg border outline-none transition-all disabled:opacity-50"
                style={{
                  background: "#080B0F",
                  borderColor: digit ? "#2F80ED" : "#1C2333",
                  color: "#F4F6F8",
                  boxShadow: digit ? "0 0 0 1px rgba(47,128,237,0.3)" : "none",
                }}
              />
            ))}
          </div>

          {verify.isPending && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#2F80ED" }} />
              <span className="text-sm" style={{ color: "#6B7280" }}>Verificando...</span>
            </div>
          )}

          <div className="text-center space-y-3">
            <Link
              href="/forgot-password"
              className="block text-sm transition-colors hover:text-[#2F80ED]"
              style={{ color: "#6B7280" }}
            >
              Usar código de recuperación
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm transition-colors hover:text-[#2F80ED]"
              style={{ color: "#6B7280" }}
            >
              <ArrowLeft className="w-3 h-3" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
