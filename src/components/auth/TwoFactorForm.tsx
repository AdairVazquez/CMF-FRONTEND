"use client";

import { useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { CmfIcon } from "@/components/shared/CmfIcon";
import { SuccessOverlay } from "@/components/auth/SuccessOverlay";
import Link from "next/link";
import { useVerify2FA } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { getRedirectByRole } from "@/types/auth";

gsap.registerPlugin(useGSAP);

export function TwoFactorForm() {
  const router = useRouter();
  const { twoFactorToken: storeToken } = useAuthStore();
  // Fallback: si Zustand aún no hidró desde localStorage, leer sessionStorage directamente
  const twoFactorToken =
    storeToken ||
    (typeof window !== "undefined" ? sessionStorage.getItem("cmf_2fa_token") : null);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const verify = useVerify2FA();

  useEffect(() => {
    if (twoFactorToken) inputRefs.current[0]?.focus();
  }, [twoFactorToken]);

  // Debug: verificar que el token llegó
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[2FA] store token:", storeToken ?? "(null)");
      console.log("[2FA] session token:", typeof window !== "undefined" ? sessionStorage.getItem("cmf_2fa_token") ?? "(null)" : "(SSR)");
      console.log("[2FA] resolved token:", twoFactorToken ? `${twoFactorToken.slice(0, 8)}...` : "(null)");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Entrada ── */
  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 32, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
    );
    gsap.to(shieldRef.current, {
      scale: 1.06,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, { scope: containerRef });

  /* ── Detectar setup exitoso ── */
  useEffect(() => {
    if (verify.isSuccess && verify.data?.data?.is_setup) {
      setShowSuccess(true);
    }
  }, [verify.isSuccess, verify.data]);

  /* ── Shake en error ── */
  useEffect(() => {
    if (verify.isError && cardRef.current) {
      gsap.fromTo(
        ".otp-input-group",
        { x: 0 },
        {
          keyframes: { x: [-8, 8, -6, 6, -4, 4, 0] },
          duration: 0.45,
          ease: "power1.out",
        }
      );
      setCode(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [verify.isError]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      verify.mutate(next.join(""));
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

  const redirectAfterSuccess = () => {
    const user = useAuthStore.getState().user;
    if (user) router.push(getRedirectByRole(user));
  };

  if (!twoFactorToken) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "#0A0D12" }}>
        <div className="w-full max-w-md p-8 rounded-2xl border text-center" style={{ background: "#0D1117", borderColor: "#1C2333" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <Shield className="w-7 h-7" style={{ color: "#ef4444" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#B9C0C8" }}>Sesión no iniciada</h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            No hay una sesión de verificación activa. Por favor inicia sesión primero.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium text-sm transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #0A2040 100%)", color: "#F4F6F8" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SuccessOverlay
        show={showSuccess}
        text="¡2FA Activado!"
        onComplete={redirectAfterSuccess}
      />

      <div
        ref={containerRef}
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ background: "#0A0D12" }}
      >
        <div
          ref={cardRef}
          className={`w-full max-w-md${showSuccess ? " opacity-0 pointer-events-none transition-opacity duration-300" : ""}`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)" }}
            >
              <CmfIcon size={22} color="#F4F6F8" />
            </div>
          </div>

          <div
            className="p-8 rounded-2xl border"
            style={{ background: "#0D1117", borderColor: "#1C2333" }}
          >
            {/* Shield */}
            <div className="flex justify-center mb-6">
              <div
                ref={shieldRef}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(47,128,237,0.1)",
                  border: "1px solid rgba(47,128,237,0.3)",
                }}
              >
                <Shield className="w-8 h-8" style={{ color: "#2F80ED" }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "#B9C0C8" }}>
              Verificación en dos pasos
            </h2>
            <p className="text-sm text-center mb-2" style={{ color: "#6B7280" }}>
              Revisa tu correo electrónico e ingresa el código
            </p>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span
                className="text-xs px-3 py-1 rounded-full border"
                style={{ background: "rgba(47,128,237,0.08)", borderColor: "rgba(47,128,237,0.2)", color: "#2F80ED" }}
              >
                Código enviado a tu correo · Válido 10 min
              </span>
            </div>

            {/* Error */}
            {verify.isError && (
              <div
                className="mb-5 px-4 py-3 rounded-lg border text-sm text-center"
                style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}
              >
                {verify.error?.message}
              </div>
            )}

            {/* OTP Inputs */}
            <div className="otp-input-group flex gap-2 justify-center mb-6">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={verify.isPending}
                  aria-label={`Dígito ${i + 1}`}
                  className="w-12 h-14 text-center text-xl font-bold font-mono rounded-lg border outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "#080B0F",
                    borderColor: digit ? "#2F80ED" : "#1C2333",
                    color: "#F4F6F8",
                    boxShadow: digit ? "0 0 0 1px rgba(47,128,237,0.3)" : "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2F80ED"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47,128,237,0.25)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = digit ? "#2F80ED" : "#1C2333"; e.currentTarget.style.boxShadow = digit ? "0 0 0 1px rgba(47,128,237,0.3)" : "none"; }}
                />
              ))}
            </div>

            {verify.isPending && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#2F80ED" }} />
                <span className="text-sm" style={{ color: "#6B7280" }}>Verificando...</span>
              </div>
            )}

            <div className="text-center space-y-3 pt-2">
              <Link
                href="#"
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
        </div>
      </div>
    </>
  );
}
