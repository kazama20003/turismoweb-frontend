export enum UserRole {
  // Roles de la aplicación (Web/Cliente)
  CLIENT = "CLIENT",

  // Roles de Administración (Panel)
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  SUPPORT = "SUPPORT",
}

export interface JwtPayload {
  _id: string          // viene desde jwt.strategy
  email: string        // viene desde el JWT
  roles: UserRole[]    // roles incluidos en el token
  iat: number          // issued-at (automático JWT)
  exp: number          // expiration (automático JWT)
  firstName?: string   // opcional si lo agregas en jwt.strategy
  lastName?: string    // opcional
}

export interface LoginCredentials {
  email: string
  password: string
}

export type LoginDto = LoginCredentials

export interface RegisterDto {
  email: string
  firstName: string
  lastName: string
  password: string
  authProvider?: "LOCAL" | "GOOGLE" | "FACEBOOK"
  country?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
}

export interface LocalRegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string          // igual a _id, pero en la respuesta del login
    email: string
    roles: UserRole[]
    firstName?: string
    lastName?: string
  }
}
