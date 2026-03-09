import { cn } from "@/lib/utils";

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
        <svg
          width={s.icon * 0.6}
          height={s.icon * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
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
