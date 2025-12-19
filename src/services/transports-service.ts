import { api } from "@/lib/api"
import type { Transport, CreateTransportDto, UpdateTransportDto } from "@/types/transport"

interface PaginatedResponse<T> {
  items?: T[]
  data?: T[]
  total?: number
  page?: number
  limit?: number
}

export const transportsService = {
  async getTransports(page = 1, limit = 10, lang = "es"): Promise<Transport[]> {
    const response = await api.get<PaginatedResponse<Transport> | Transport[]>("/transports", {
      params: { page, limit, lang },
    })
    const result = response.data

    if (Array.isArray(result)) {
      return result
    }
    if (result && typeof result === "object") {
      if ("items" in result && Array.isArray(result.items)) {
        return result.items
      }
      if ("data" in result && Array.isArray(result.data)) {
        return result.data
      }
    }
    return []
  },

  async getTransportById(id: string) {
    const response = await api.get<Transport>(`/transports/${id}`)
    return response.data
  },

  async getTransportBySlug(slug: string, lang = "es"): Promise<Transport> {
  const response = await api.get<Transport>(`/transports/slug/${slug}`, {
    params: { lang },
  });
  return response.data;
}
,
  async createTransport(data: CreateTransportDto) {
    const response = await api.post<Transport>("/transports", data)
    return response.data
  },

  async updateTransport(id: string, data: UpdateTransportDto) {
    const response = await api.patch<Transport>(`/transports/${id}`, data)
    return response.data
  },

  async deleteTransport(id: string) {
    const response = await api.delete<{ message: string }>(`/transports/${id}`)
    return response.data
  },
}
