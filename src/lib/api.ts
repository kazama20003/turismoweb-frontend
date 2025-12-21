import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { API_BASE_URL } from "@/lib/constants"

type RequestOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: TBody
  headers?: Record<string, string>
}

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Interceptor global de errores (Opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Silenciosamente manejar 401 sin loguear error (usuario no autenticado es esperado)
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
      // No loguear el error 401, es un estado esperado cuando no hay usuario
      return Promise.reject(new Error("Unauthorized"))
    }
    // Solo loguear otros errores
    if (error.response) {
      console.error("[API Error]", error.response.data?.message || error.response.statusText)
    }
    return Promise.reject(error)
  },
)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


export async function apiClient<TResponse, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, headers = {} } = options

  const config: AxiosRequestConfig = {
    method,
    headers,
    ...(body && { data: body }),
    url: endpoint,
  }

  const response: AxiosResponse<TResponse> = await api.request<TResponse>(config)

  // Axios NO usa ok: se valida con status
  if (response.status < 200 || response.status >= 300) {
    const errorData = response.data as { message?: string }
    throw new Error(errorData.message ?? `Error: ${response.status}`)
  }

  return response.data
}

// Métodos HTTP helpers
export const apiGet = <T>(endpoint: string, headers?: Record<string, string>) =>
  apiClient<T>(endpoint, { method: "GET", headers })

export const apiPost = <T, B>(endpoint: string, body?: B, headers?: Record<string, string>) =>
  apiClient<T, B>(endpoint, { method: "POST", body, headers })

export const apiPut = <T, B>(endpoint: string, body?: B, headers?: Record<string, string>) =>
  apiClient<T, B>(endpoint, { method: "PUT", body, headers })

export const apiPatch = <T, B>(endpoint: string, body?: B, headers?: Record<string, string>) =>
  apiClient<T, B>(endpoint, { method: "PATCH", body, headers })

export const apiDelete = <T>(endpoint: string, headers?: Record<string, string>) =>
  apiClient<T>(endpoint, { method: "DELETE", headers })
