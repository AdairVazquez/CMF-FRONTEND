"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { X } from "lucide-react"; // Si no tienes lucide-react, puedes usar una "X" de texto

// --- COMPONENTE INTERNO DE TAGS ---
const TagsInput = ({ tags, setTags }: { tags: string[], setTags: (tags: string[]) => void }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = input.trim().replace(/,/g, "");
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setInput("");
      }
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1 md:col-span-2">
      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Módulos habilitados</label>
      <div className="flex flex-wrap gap-2 p-2 bg-white/5 border border-white/10 rounded-lg min-h-[45px] focus-within:border-blue-500/50 transition-all">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20">
            {tag}
            <button 
              type="button" 
              onClick={() => setTags(tags.filter((_, i) => i !== index))}
              className="hover:text-red-400 ml-1 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Escribe un módulo y pulsa Enter (ej: asistencia)..." : ""}
          className="flex-1 bg-transparent outline-none text-sm text-white min-w-[150px]"
        />
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function ModalNuevaEmpresa({ isOpen, onClose, onRefresh, mode, empresaId }: any) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
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
      const fetchEmpresa = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/v1/companies/${empresaId}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          const result = await response.json();
          const u = result.data;
          setFormData({
            name: u.name || "",
            legal_name: u.legal_name || "",
            tax_id: u.tax_id || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
            plan: u.plan || "prueba",
            status: u.status || "activo",
            timezone: u.timezone || "America/Mexico_City",
            modules: u.modules || [], // <-- Aquí se cargan tus datos de la BD
          });
        } catch (error) { console.error("Error cargando empresa", error); }
      };
      if (token) fetchEmpresa();
    } else {
      handleResetFields();
    }
  }, [token, mode, isOpen, empresaId]);

  const handleResetFields = () => {
    setFormData({
      name: "", legal_name: "", tax_id: "", email: "", phone: "",
      address: "", plan: "prueba", status: "activo", 
      timezone: "America/Mexico_City", modules: [],
    });
    setLogo(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => data.append(`${key}[]`, v));
      } else {
        data.append(key, value);
      }
    });
    if (logo) data.append("logo", logo);

    try {
      const url = mode === "editar" ? `http://localhost:8000/api/v1/companies/${empresaId}` : "http://localhost:8000/api/v1/companies";
      if (mode === "editar") data.append("_method", "PUT");

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Operación exitosa");
        onRefresh();
        onClose();
      } else {
        if (result.errors) setErrors(result.errors);
        toast.error(result.message || "Error de validación");
      }
    } catch (error) { toast.error("Error de conexión"); } 
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-blue-500">
          {mode === "editar" ? "Editar Empresa" : "Registrar Nueva Empresa"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Nombre Comercial</label>
            <input 
              required autoComplete="off"
              className="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Razón Social</label>
            <input 
              required autoComplete="off"
              className="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 transition-colors"
              value={formData.legal_name}
              onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">RFC / Tax ID</label>
            <input 
              className="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.tax_id}
              onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Email Corporativo</label>
            <input 
              type="email"
              className="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1 text-white">
            <label className="text-xs text-gray-400">Plan</label>
            <select 
              className="bg-[#2a2a2a] border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            >
              <option value="prueba">Prueba</option>
              <option value="basico">Básico</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Estado</label>
            <select 
              className="bg-[#2a2a2a] border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs text-gray-400">Dirección Física</label>
            <input 
              className="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* INPUT DE TAGS INTEGRADO */}
          <TagsInput 
            tags={formData.modules} 
            setTags={(newTags) => setFormData({ ...formData, modules: newTags })} 
          />

          {/* LOGO */}
          <div className="md:col-span-2 space-y-2 mt-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Logo (SVG)</label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${logo ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:bg-white/5'}`}>
              <input 
                type="file" accept=".svg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
              <p className="text-center text-sm text-gray-400">
                {logo ? logo.name : "Click para subir o arrastra un archivo"}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white px-4">Cancelar</button>
            <button 
              type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Procesando..." : mode === "editar" ? "Actualizar" : "Crear Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}