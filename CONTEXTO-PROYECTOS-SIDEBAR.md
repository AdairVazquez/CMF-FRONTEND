# Contexto: Sección "Proyectos" en el sidebar del dashboard (para Claude Code)

## 1. Proyecto y stack

- **Proyecto:** `system-admin-dashboard` (Next.js, App Router).
- **App:** ZEPHYREA, panel de administración con roles (super_admin, director, rh, jefe_area, operador).
- **Auth:** `useAuthStore()` y `getUserRole(user)` desde `@/types/auth`. El usuario y su rol determinan qué ve en el sidebar.

---

## 2. Lo que se quitó y hay que volver a conectar

En el sidebar se **eliminó la sección "Proyectos"** para dejar solo lo imprescindible. Esa sección debe volver a mostrarse y tener **lógica detrás** (de dónde salen los proyectos, por rol/empresa, etc.), integrada con este dashboard.

- **Componente que ya existe:** `src/components/dashboard/NavProjects.tsx`.
- **No está usado** en `AppSidebar.tsx` (se dejó de renderizar).

---

## 3. Estructura actual del sidebar

**Archivo:** `src/components/dashboard/AppSidebar.tsx`

- **Header:** Logo ZEPHYREA (bloque decorativo, no link). En colapsado: botón azul con icono blanco.
- **Contenido (`SidebarContent`):**
  - Solo **NavMain** con ítems por rol (`NAV_MAIN_BY_ROLE`): Dashboard, Operación (Empleados, Asistencia, Reportes), Administración (Empresas, Usuarios, Roles, etc.), según rol.
- **Footer:** **NavUser** (avatar, nombre, email, menú con Cerrar sesión).
- **SidebarRail** para colapsar/expandir.

No hay bloque de "Proyectos" ni datos de proyectos en el sidebar.

---

## 4. Componente NavProjects (ya implementado)

**Ruta:** `src/components/dashboard/NavProjects.tsx`

**Props:**

- `projects`: array de `{ name: string, url: string, icon: LucideIcon }`.
- `label?`: string (por defecto `"Proyectos"`).

**Comportamiento:**

- Renderiza un `SidebarGroup` con título (`SidebarGroupLabel`) y un `SidebarMenu`.
- Por cada proyecto: enlace (`SidebarMenuButton asChild` + `<a>`) con icono y nombre.
- Cada ítem tiene un `SidebarMenuAction` (tres puntos) con dropdown: "View Project", "Share Project", separador, "Delete Project" (ahora son solo UI, sin lógica).
- Al final un ítem "More" con icono de tres puntos.
- Tiene `className="group-data-[collapsible=icon]:hidden"`: **toda la sección se oculta cuando el sidebar está colapsado** (solo iconos).

**Qué falta por tu parte:**

- Definir **de dónde vienen los proyectos** (API, store, filtro por rol/empresa, etc.).
- Decidir si los ítems del dropdown (ver, compartir, eliminar) llaman a backend o a rutas del dashboard.
- Volver a meter `<NavProjects projects={...} />` en `AppSidebar` dentro de `SidebarContent`, **debajo de NavMain**.

---

## 5. Cómo integrar de nuevo en AppSidebar

En `AppSidebar.tsx`:

1. Importar `NavProjects` y los iconos que quieras para cada proyecto (ej. desde `lucide-react`).
2. Definir o obtener el array `projects` (estático por ahora o desde hook/API según tu lógica).
3. En `SidebarContent`, después de `<NavMain ... />`, añadir:

   ```tsx
   <NavProjects projects={projects} label="Proyectos" />
   ```

4. Si los proyectos dependen del rol o de la empresa del usuario, calcular `projects` a partir de `user` / `getUserRole(user)` o del contexto que uses (empresa, permisos, etc.).

---

## 6. Resumen para implementar la lógica

- **UI:** NavProjects ya está hecha; solo hay que usarla en AppSidebar y pasarle `projects` (y opcionalmente `label`).
- **Lógica a definir por ti:**
  - Origen de datos: lista estática, endpoint (ej. `GET /api/projects` o por empresa), o store (Zustand, etc.).
  - Filtro por rol o por empresa del usuario, si aplica.
  - URLs de cada proyecto: pueden ser rutas del dashboard (ej. `/dashboard/proyectos/[id]`) o externas.
  - Acciones del dropdown (View / Share / Delete): si deben llamar a APIs o navegar a páginas del dashboard, implementarlas en handlers y conectar con el backend según tus reglas de negocio.

Con este contexto puedes pedir en Claude Code que te ayude a: (1) conectar la fuente de datos de proyectos, (2) integrar NavProjects en AppSidebar, y (3) implementar la lógica detrás de los botones del dropdown de cada proyecto.
