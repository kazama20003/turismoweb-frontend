import { UserRole } from "@/types/user"
export { UserRole }

export interface JwtPayload {
  _id: string
  email: string
  roles: UserRole[]
  iat: number
  exp: number
  firstName?: string
  lastName?: string
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
    id: string
    email: string
    roles: UserRole[]
    firstName?: string
    lastName?: string
  }
}
