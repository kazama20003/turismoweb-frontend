import { api } from "@/lib/api"
import type { AuthResponse, LoginCredentials } from "@/types/auth"
import type { User, UpdateUserDto } from "@/types/user"

interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  authProvider: "LOCAL" | "GOOGLE" | "FACEBOOK"
  password?: string
  externalId?: string
  roles?: string[]
  country?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
  avatar?: string
}

// Tipo para respuestas que tengan token con distintos nombres
interface TokenResponse {
  access_token?: string
  accessToken?: string
  token?: string
  refreshToken?: string
}

function extractToken(data: TokenResponse): string | null {
  return (
    data.access_token ||
    data.accessToken ||
    data.token ||
    null
  )
}

export const authService = {
  // REGISTER
  async register(data: CreateUserDto) {
    const response = await api.post<AuthResponse>("/auth/register", data)
    const res = response.data

    const token = extractToken(res as TokenResponse)

    if (token) {
      localStorage.setItem("token", token)
    }

    return res
  },

  // LOGIN
  async loginLocal(credentials: LoginCredentials) {
    const response = await api.post<AuthResponse>("/auth/login/local", credentials)
    const data = response.data

    const token = extractToken(data as TokenResponse)

    if (token) {
      localStorage.setItem("token", token)
    }

    return data
  },

  // PROFILE
  async getProfile() {
    const response = await api.get<User>("/auth/profile")
    return response.data
  },

  // UPDATE
  async updateProfile(id: string, data: UpdateUserDto) {
    const response = await api.patch<User>(`/auth/${id}`, data)
    return response.data
  },

  // LOGOUT
  async logout() {
    const response = await api.post("/auth/logout")
    localStorage.removeItem("token")
    return response.data
  },

  // OAuth URLs
  getGoogleAuthUrl() {
    return `${api.defaults.baseURL}/auth/google`
  },

  getGoogleRedirectUrl() {
    return `${api.defaults.baseURL}/auth/google/redirect`
  },

  getFacebookAuthUrl() {
    return `${api.defaults.baseURL}/auth/facebook`
  },

  getFacebookRedirectUrl() {
    return `${api.defaults.baseURL}/auth/facebook/redirect`
  },
}
