export type CompanyStatus = "activo" | "inactivo" | "suspendido" | "prueba"

export interface CompanyFull {
  id: number
  name: string
  legal_name?: string
  tax_id?: string
  email?: string
  phone?: string
  plan: string
  status: CompanyStatus
  timezone?: string
  modules: string[]
  trial_ends_at?: string | null
  subscription_ends_at?: string | null
  created_at: string
  employees_count?: number
  users_count?: number
}
