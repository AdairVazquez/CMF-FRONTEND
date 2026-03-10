import { cn } from "@/lib/utils";
import { CmfIcon } from "./CmfIcon";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 28, title: "text-lg", sub: "text-xs" },
    md: { icon: 36, title: "text-xl", sub: "text-xs" },
    lg: { icon: 48, title: "text-3xl", sub: "text-sm" },
  };
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative flex items-center justify-center rounded-lg"
        style={{
          width: s.icon,
          height: s.icon,
          background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)",
          boxShadow: "0 0 20px rgba(47, 128, 237, 0.3)",
        }}
      >
        <CmfIcon size={s.icon * 0.6} color="#F4F6F8" />
      </div>
      {showText && (
        <div>
          <div
            className={cn("font-bold leading-none tracking-wider", s.title)}
            style={{ color: "#B9C0C8" }}
          >
            CMF
          </div>
          <div className={cn("leading-none mt-0.5", s.sub)} style={{ color: "#6B7280" }}>
            Control Laboral
          </div>
        </div>
      )}
    </div>
  );
}
