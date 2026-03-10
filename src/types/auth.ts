export interface Role {
  id: number;
  name: string;
  slug: string;
  hierarchy_level: number;
}

export interface Company {
  id: number;
  name: string;
  plan: string;
  modules: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  two_factor_enabled: boolean;
  two_factor_confirmed_at: string | null;
  company_id: number | null;
  company: Company | null;
  roles: Role[];
}

export interface LoginResponse {
  requires_2fa?: boolean;
  requires_2fa_setup?: boolean;
  is_setup?: boolean;
  token: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TwoFactorVerifyRequest {
  token: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  reset_token: string;
  expires_at: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  password: string;
  password_confirmation: string;
}

/** Helper: obtiene el slug del rol principal del usuario */
export function getUserRole(user: User): string {
  if (user.is_super_admin) return "super_admin";
  return user.roles[0]?.slug ?? "operador";
}

/** Helper: ruta de redirect según rol */
export function getRedirectByRole(user: User): string {
  const role = getUserRole(user);
  switch (role) {
    case "super_admin": return "/dashboard/super";
    case "director":    return "/dashboard";
    case "rh":          return "/dashboard/asistencia";
    case "jefe_area":   return "/dashboard/asistencia";
    case "operador":    return "/dashboard/dispositivos";
    default:            return "/dashboard";
  }
}
