export interface Company {
  id: number;
  name: string;
  modules: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  two_factor_enabled: boolean;
  company: Company | null;
}

export interface LoginResponse {
  requires_2fa: boolean;
  two_factor_token?: string;
  user?: User;
  token?: string;
  token_type?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TwoFactorRequest {
  code: string;
  two_factor_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}
