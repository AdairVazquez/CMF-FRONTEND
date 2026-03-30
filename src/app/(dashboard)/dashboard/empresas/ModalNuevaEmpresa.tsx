"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function ModalNuevaEmpresa({ isOpen, onClose, onRefresh, mode, empresaId }: {
    mode: string;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    empresaId?: number;
}) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [empresa, setEmpresa] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        legal_name: "",
        tax_id: "",
        email: "",
        phone: "",
        address: "",
        plan: "prueba",
        status: "activo",
        timezone: "America/Mexico_City",
        modules: [] as string[],
    });
    const [logo, setLogo] = useState<File | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "editar" && empresaId) {
            // Cargar datos de la empresa a editar
            const fetchEmpresa = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/v1/companies/${empresaId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                    const result = await response.json();
                    const u = result.data;
                    setEmpresa(u);
                    setFormData({
                        name: u.name || "Error",
                        legal_name: u.legal_name || "",
                        tax_id: u.tax_id || "",
                        email: u.email || "",
                        phone: u.phone || "",
                        address: u.address || "",
                        plan: u.plan || "prueba",
                        status: u.status || "activo",
                        timezone: u.timezone || "America/Mexico_City",
                        modules: u.modules || [],
                    });
                    console.log("Empresa a editar:", u.name);
                } catch (error) {
                    console.error("Error al cargar empresa:", error);
                }
            };

            if (token) fetchEmpresa();
        } else {
            // Limpiar el formulario si NO es edición
            setEmpresa(null);
            setFormData({
                name: "",
                legal_name: "",
                tax_id: "",
                email: "",
                phone: "",
                address: "",
                plan: "prueba",
                status: "activo",
                timezone: "America/Mexico_City",
                modules: [],
            });
            setLogo(null);
            setErrors({});
        }
    }, [token, mode, isOpen, empresaId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => data.append(`${key}[]`, v));
            } else {
                data.append(key, value);
            }
        });
        if (logo) data.append("logo", logo);

        try {
            const url = mode === "editar" && empresaId
                ? `http://localhost:8000/api/v1/companies/${empresaId}`
                : "http://localhost:8000/api/v1/companies";
            const method = mode === "editar" ? "POST" : "POST";
            if (mode === "editar") data.append("_method", "PUT");

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: data,
            });

            const result = await response.json();
            if (response.ok) {
                setErrors({});
                toast.success(result.message || (mode === "editar" ? "Empresa actualizada correctamente" : "Empresa registrada correctamente"));
                onRefresh();
                onClose();
            } else {
                if (result.errors) setErrors(result.errors);
                toast.error(result.message || "Error al validar los datos");
                console.error("Errores:", result.errors);
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
            console.error("Error al enviar empresa:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetAndClose = () => {
        setFormData({
            name: "",
            legal_name: "",
            tax_id: "",
            email: "",
            phone: "",
            address: "",
            plan: "prueba",
            status: "activo",
            timezone: "America/Mexico_City",
            modules: [],
        });
        setLogo(null);
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl">
                <h2 className="text-xl font-bold mb-4">{mode === "editar" ? "Editar Empresa" : "Registrar Nueva Empresa"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre Comercial */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Nombre Comercial</label>
                        <input
                            required
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            value={formData.name}
                        />
                        {errors.name && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.name[0]}</span>
                        )}
                    </div>

                    {/* Razón Social */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Razón Social</label>
                        <input
                            required
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.legal_name ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            value={formData.legal_name}
                            onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                        />
                        {errors.legal_name && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.legal_name[0]}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.email[0]}</span>
                        )}
                    </div>

                    {/* Telefono */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Telefono</label>
                        <input
                            placeholder="Teléfono (ej: +52771...)"
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.phone[0]}</span>
                        )}
                    </div>

                    {/* Plan */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Plan de la empresa</label>
                        <select
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.plan ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            value={formData.plan}
                            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        >
                            <option value="prueba">Prueba</option>
                            <option value="basico">Básico</option>
                            <option value="pro">Pro</option>
                        </select>
                        {errors.plan && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.plan[0]}</span>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Estado de la empresa</label>
                        <select
                            className="bg-[#2a2a2a] border border-white/10 rounded-lg p-2"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    {/* Dirección */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Dirección de la empresa</label>
                        <input
                            required
                            className={`bg-white/5 border rounded-lg p-2 outline-none transition-colors ${errors.address ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        {errors.address && (
                            <span className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.address[0]}</span>
                        )}
                    </div>

                    {/* Logo */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Logo de la Empresa (SVG)</label>
                        <div className={`relative group border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center p-6 ${logo ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/40 hover:bg-white/5'}`}>
                            <input
                                type="file"
                                accept=".svg"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                            />
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${logo ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {logo ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-200">
                                        {logo ? <span className="text-blue-400">{logo.name}</span> : <>Haga clic para subir <span className="text-gray-500">o arrastre y suelte</span></>}
                                    </p>
                                    <p className="text-xs text-gray-500">Solo archivos SVG (Máx. 2MB)</p>
                                </div>
                            </div>
                            {logo && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); setLogo(null); }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all z-20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button type="button" onClick={handleResetAndClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium transition-all">
                            {loading ? "Guardando..." : mode === "editar" ? "Actualizar Empresa" : "Crear Empresa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}