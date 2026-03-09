"use client";

import { Users, Clock, CreditCard, Monitor } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { getGreeting } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      title: "Empleados presentes",
      value: "--",
      icon: Users,
      description: "Asistencia de hoy",
      accent: "#2F80ED",
    },
    {
      title: "Empleados activos",
      value: "--",
      icon: Clock,
      description: "Total en el sistema",
      accent: "#22c55e",
    },
    {
      title: "Registros de hoy",
      value: "--",
      icon: CreditCard,
      description: "Entradas y salidas",
      accent: "#f97316",
    },
    {
      title: "Dispositivos activos",
      value: "--",
      icon: Monitor,
      description: "Lectores NFC en línea",
      accent: "#a855f7",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#B9C0C8" }}>
          {user?.name ? getGreeting(user.name) : "Bienvenido"}
        </h1>
        {user?.company && (
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {user.company.name}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {["Actividad reciente", "Dispositivos"].map((title) => (
          <div
            key={title}
            className="p-6 rounded-xl border"
            style={{ background: "#0D1117", borderColor: "#1C2333" }}
          >
            <h2 className="text-base font-semibold mb-4" style={{ color: "#B9C0C8" }}>
              {title}
            </h2>
            <div className="flex items-center justify-center h-32">
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Los datos estarán disponibles próximamente
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
