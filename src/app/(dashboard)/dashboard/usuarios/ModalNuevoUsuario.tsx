"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { set } from "zod";

type CompanyOption = {
    id: number | string;
    name: string;
};

export function ModalNuevoUsuario({ isOpen, onClose, onRefresh, mode, user }: {
    isOpen: boolean;
    mode: string;
    user?: number;
    onClose: () => void;
    onRefresh: () => void;
}) {
    const { token } = useAuthStore();

    const modalOverlayClassName = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4";
    const modalContentClassName = "bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl";
    const inputClassName = "bg-white/5 border rounded-lg p-2 outline-none transition-colors";
    const errorClassName = "text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1";

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [empresas, setEmpresas] = useState<CompanyOption[]>([]);
    const [usuario, setUsuario] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        company_id: "",
        email: "",
        phone: "",
        password: "",
        is_super_admin: false,
    });

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/companies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const result = await response.json();
                const dataArray = result.data?.data || result.data || [];
                setEmpresas(dataArray);
            } catch (error) {
                console.error("Error al cargar empresas:", error);
            }
        };

        if (token) fetchEmpresas();
    }, [token]);

    useEffect(() => {
        if (!isOpen) return;
        if (mode !== "editar" || !user) return;
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/user/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const result = await response.json();
                const u = result.data;
                setUsuario(u);
                setFormData({
                    name: u.name || "",
                    company_id: u.company_id ? String(u.company_id) : "",
                    email: u.email || "",
                    phone: u.phone || "",
                    password: "",
                    is_super_admin: Boolean(u.is_super_admin),
                });
            } catch (error) {
                console.error("Error al cargar usuario:", error);
            }
        };
        if (token) fetchUsuario();
    }, [token, mode, user, isOpen]);
    if (!isOpen) return null;
    const resetForm = () => {
        setFormData({
            name: "",
            company_id: "",
            email: "",
            phone: "",
            password: "",
            is_super_admin: false,
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: formData.name.trim(),
            company_id: formData.company_id ? Number(formData.company_id) : null,
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            is_super_admin: formData.is_super_admin,
        };
        if (mode === "editar" && user) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/user/${user}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (response.ok) {
                    resetForm();
                    toast.success(result.message || "Usuario registrado correctamente");
                    onRefresh();
                    onClose();
                } else {
                    if (result.errors) {
                        setErrors(result.errors);
                    }
                    toast.error(result.message || "Error al validar");
                }
            } catch {
                toast.error("Error de conexion");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await fetch("http://localhost:8000/api/v1/user", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (response.ok) {
                    resetForm();
                    toast.success(result.message || "Usuario registrado correctamente");
                    onRefresh();
                    onClose();
                } else {
                    if (result.errors) {
                        setErrors(result.errors);
                    }
                    toast.error(result.message || "Error al validar");
                }
            } catch {
                toast.error("Error de conexion");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResetAndClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className={modalOverlayClassName}>
            <div className={modalContentClassName}>
                <h2 className="text-xl font-bold mb-4">Registrar Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Nombre</label>
                        <input
                            required
                            className={`${inputClassName} ${errors.name ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                }`}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && (
                            <span className={errorClassName}>
                                {errors.name[0]}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Empresa</label>
                        <select
                            className={`${inputClassName} ${errors.company_id ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                }`}
                            value={formData.company_id}
                            onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                        >
                            <option value="">Seleccionar empresa</option>
                            {empresas.map((empresa) => (
                                <option key={empresa.id} value={empresa.id}>
                                    {empresa.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_id && (
                            <span className={errorClassName}>
                                {errors.company_id[0]}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className={`${inputClassName} ${errors.email ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                }`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && (
                            <span className={errorClassName}>
                                {errors.email[0]}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Telefono</label>
                        <input
                            placeholder="Telefono (ej: +52771...)"
                            className={`${inputClassName} ${errors.phone ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                }`}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && (
                            <span className={errorClassName}>
                                {errors.phone[0]}
                            </span>
                        )}
                    </div>

                    {mode !== "editar" && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Password</label>
                            <input
                                type="password"
                                className={`${inputClassName} ${errors.password ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                    }`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            {errors.password && (
                                <span className={errorClassName}>
                                    {errors.password[0]}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Tipo de usuario</label>
                        <select
                            className={`bg-[#2a2a2a] border rounded-lg p-2 outline-none transition-colors text-white ${errors.is_super_admin ? "border-red-500/50" : "border-white/10 focus:border-blue-500"
                                }`}
                            style={{ colorScheme: "dark" }}
                            value={String(formData.is_super_admin)}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    is_super_admin: e.target.value === "true",
                                })
                            }
                        >
                            <option value="false">Usuario normal</option>
                            <option value="true">Super Admin</option>
                        </select>
                        {errors.is_super_admin && (
                            <span className={errorClassName}>
                                {errors.is_super_admin[0]}
                            </span>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleResetAndClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                            {loading
                                ? "Guardando..."
                                : mode === "editar"
                                    ? "Guardar cambios"
                                    : "Crear Usuario"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
