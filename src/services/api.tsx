"use client"
import { resolveLocale } from "@/lib/i18n/config"

// ============================================================================
// TYPES
// ============================================================================

export interface ApiConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  enableLogging: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  errors?: Record<string, string[]>
  originalError?: unknown
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
  timeout?: number
  retry?: boolean
  skipAuth?: boolean
  skipErrorNotification?: boolean
}

function getLocalizedAuthPath(path: "/login"): string {
  if (typeof window === "undefined") return path
  const locale = resolveLocale(window.location.pathname.split("/")[1])
  return `/${locale}${path}`
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ApiException extends Error {
  status?: number
  code?: string
  errors?: Record<string, string[]>
  originalError?: unknown

  constructor(message: string, status?: number, code?: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiException"
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export class NetworkError extends ApiException {
  constructor(message = "Error de conexión. Verifica tu internet.") {
    super(message, 0, "NETWORK_ERROR")
    this.name = "NetworkError"
  }
}

export class TimeoutError extends ApiException {
  constructor(message = "La solicitud tardó demasiado tiempo.") {
    super(message, 408, "TIMEOUT_ERROR")
    this.name = "TimeoutError"
  }
}

export class AuthenticationError extends ApiException {
  constructor(message = "No autorizado. Por favor inicia sesión.") {
    super(message, 401, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends ApiException {
  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class ValidationError extends ApiException {
  constructor(message = "Error de validación.", errors?: Record<string, string[]>) {
    super(message, 422, "VALIDATION_ERROR", errors)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends ApiException {
  constructor(message = "Recurso no encontrado.") {
    super(message, 404, "NOT_FOUND_ERROR")
    this.name = "NotFoundError"
  }
}

export class ServerError extends ApiException {
  constructor(message = "Error del servidor. Intenta más tarde.") {
    super(message, 500, "SERVER_ERROR")
    this.name = "ServerError"
  }
}

// ============================================================================
// TOKEN MANAGER
// ============================================================================

class TokenManager {
  private static instance: TokenManager
  private refreshPromise: Promise<string> | null = null
  private pendingRequests: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("token", token)
  }

  removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  }

  setRefreshToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("refreshToken", token)
  }

  removeRefreshToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("refreshToken")
  }

  async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()

    try {
      const newToken = await this.refreshPromise
      this.pendingRequests.forEach(({ resolve }) => resolve(newToken))
      this.pendingRequests = []
      return newToken
    } catch (error) {
      this.pendingRequests.forEach(({ reject }) => reject(error))
      this.pendingRequests = []
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      throw new AuthenticationError("No hay token de refresco disponible")
    }

    try {
      const response = await fetch(`${apiClient.config.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new AuthenticationError("No se pudo refrescar el token")
      }

      const data = (await response.json()) as { token?: string; accessToken?: string; refreshToken?: string }
      const newToken = data.token || data.accessToken

      if (!newToken) {
        throw new AuthenticationError("Token no recibido del servidor")
      }

      this.setToken(newToken)
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken)
      }

      return newToken
    } catch (error) {
      this.removeToken()
      this.removeRefreshToken()
      throw error
    }
  }

  clearTokens(): void {
    this.removeToken()
    this.removeRefreshToken()
  }
}

// ============================================================================
// API CLIENT
// ============================================================================

import { toast } from "sonner"

class ApiClient {
  config: ApiConfig
  private tokenManager: TokenManager
  private requestQueue: Map<string, AbortController> = new Map()

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api",
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: process.env.NODE_ENV === "development",
      ...config,
    }
    this.tokenManager = TokenManager.getInstance()
  }

  setBaseURL(url: string): void {
    this.config.baseURL = url
  }

  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[API Client] ${message}`, data || "")
    }
  }

  private logError(message: string, error?: unknown): void {
    if (this.config.enableLogging) {
      console.error(`[API Client] ${message}`, error || "")
    }
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Remove leading slash from endpoint if present to avoid overriding baseURL path
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint

    // Ensure baseURL ends with slash for proper URL joining
    const baseURL = this.config.baseURL.endsWith("/") ? this.config.baseURL : `${this.config.baseURL}/`

    const url = new URL(cleanEndpoint, baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private buildHeaders(config?: RequestConfig): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (!config?.skipAuth) {
      const token = this.tokenManager.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    if (config?.headers) {
      Object.assign(headers, config.headers)
    }

    return headers
  }

  private createTimeoutSignal(timeout?: number): AbortSignal {
    const controller = new AbortController()
    const timeoutMs = timeout || this.config.timeout

    setTimeout(() => controller.abort(), timeoutMs)

    return controller.signal
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type")
    let data: T

    if (contentType?.includes("application/json")) {
      data = (await response.json()) as T
    } else {
      data = (await response.text()) as T
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    }
  }

  private handleError(error: unknown, response?: Response): ApiException {
    this.logError("Request failed", error)

    const err = error as Error & { code?: string; errors?: Record<string, string[]> }

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      return new NetworkError()
    }

    if (err.name === "AbortError") {
      return new TimeoutError()
    }

    if (response) {
      const status = response.status

      switch (status) {
        case 401:
          return new AuthenticationError()
        case 403:
          return new AuthorizationError()
        case 404:
          return new NotFoundError()
        case 422:
          return new ValidationError(err.message || "Error de validación", err.errors)
        case 500:
        case 502:
        case 503:
        case 504:
          return new ServerError()
        default:
          return new ApiException(err.message || "Error desconocido", status, err.code)
      }
    }

    return new ApiException(err.message || "Error desconocido")
  }

  private async retryRequest<T>(fn: () => Promise<ApiResponse<T>>, attempt = 0): Promise<ApiResponse<T>> {
    try {
      return await fn()
    } catch (error) {
      const apiError = error as ApiException

      if (
        apiError.status &&
        apiError.status >= 400 &&
        apiError.status < 500 &&
        apiError.status !== 408 &&
        apiError.status !== 429
      ) {
        throw error
      }

      if (attempt < this.config.retryAttempts) {
        const delay = this.config.retryDelay * Math.pow(2, attempt)
        this.log(`Retrying request in ${delay}ms (attempt ${attempt + 1})`)

        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.retryRequest(fn, attempt + 1)
      }

      throw error
    }
  }

  private async request<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params)
    const headers = this.buildHeaders(config)
    const signal = this.createTimeoutSignal(config?.timeout)

    this.log(`${config?.method || "GET"} ${url}`)

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(url, {
          ...config,
          headers,
          signal,
        })

        if (response.status === 401 && !config?.skipAuth) {
          try {
            const newToken = await this.tokenManager.refreshAccessToken()
            this.log("Token refreshed, retrying request")

            const newHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            }

            const retryResponse = await fetch(url, {
              ...config,
              headers: newHeaders,
              signal: this.createTimeoutSignal(config?.timeout),
            })

            if (!retryResponse.ok) {
              const parsedResponse = await this.parseResponse<T>(retryResponse)
              throw this.handleError(parsedResponse.data, retryResponse)
            }

            return this.parseResponse<T>(retryResponse)
          } catch (refreshError) {
            this.logError("Token refresh failed", refreshError)
            this.tokenManager.clearTokens()

            if (typeof window !== "undefined") {
              window.location.href = getLocalizedAuthPath("/login")
            }

            throw new AuthenticationError()
          }
        }

        if (!response.ok) {
          const parsedResponse = await this.parseResponse<T>(response)
          throw this.handleError(parsedResponse.data, response)
        }

        return this.parseResponse<T>(response)
      } catch (error) {
        throw this.handleError(error)
      }
    }

    try {
      const shouldRetry = config?.retry !== false
      const response = shouldRetry ? await this.retryRequest(makeRequest) : await makeRequest()

      this.log("Request successful", response)
      return response
    } catch (error) {
      const apiError = error as ApiException

      if (!config?.skipErrorNotification) {
        this.showErrorNotification(apiError)
      }

      throw apiError
    }
  }

  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patch<T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }

  cancelRequest(key: string): void {
    const controller = this.requestQueue.get(key)
    if (controller) {
      controller.abort()
      this.requestQueue.delete(key)
      this.log(`Request cancelled: ${key}`)
    }
  }

  cancelAllRequests(): void {
    this.requestQueue.forEach((controller) => controller.abort())
    this.requestQueue.clear()
    this.log("All requests cancelled")
  }

  async login(credentials: { email: string; password: string }): Promise<
    ApiResponse<{ token?: string; refreshToken?: string }>
  > {
    const response = await this.post<{ token?: string; refreshToken?: string }>("/auth/login", credentials, {
      skipAuth: true,
    })

    const responseData = response.data as { token?: string; refreshToken?: string }

    if (responseData.token) {
      this.tokenManager.setToken(responseData.token)
    }
    if (responseData.refreshToken) {
      this.tokenManager.setRefreshToken(responseData.refreshToken)
    }

    return response
  }

  logout(): void {
    this.tokenManager.clearTokens()
    if (typeof window !== "undefined") {
      window.location.href = getLocalizedAuthPath("/login")
    }
  }

  isAuthenticated(): boolean {
    return !!this.tokenManager.getToken()
  }

  private showErrorNotification(error: ApiException): void {
    const message = error.message || "Ha ocurrido un error"

    if (error instanceof ValidationError && error.errors) {
      const errorMessages = Object.values(error.errors).flat()
      toast.error(message, {
        description: errorMessages.join(", "),
      })
    } else {
      toast.error(message)
    }
  }
}

export const apiClient = new ApiClient()

export { ApiClient, TokenManager }

export const api = {
  get: <T = unknown>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient.post<T>(endpoint, data, config),
  put: <T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient.put<T>(endpoint, data, config),
  patch: <T = unknown>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient.patch<T>(endpoint, data, config),
  delete: <T = unknown>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  login: (credentials: { email: string; password: string }) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  isAuthenticated: () => apiClient.isAuthenticated(),
}
