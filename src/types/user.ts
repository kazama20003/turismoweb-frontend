export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  SUPPORT = "SUPPORT",
}

export interface User {
  _id: string
  id?: string
  email: string
  firstName: string
  lastName: string
  fullName?: string
  authProvider: AuthProvider | string
  roles: UserRole[]
  isActive?: boolean
  country?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
  externalId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  authProvider: string
  password?: string
  externalId?: string
  roles?: UserRole[]
  country?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  country?: string
  password?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
  roles?: UserRole[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
