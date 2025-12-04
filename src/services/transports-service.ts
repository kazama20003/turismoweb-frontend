import { api } from "@/lib/api"
import type { Transport, CreateTransportDto, UpdateTransportDto } from "@/types/transport"

export const transportsService = {
  // GET /transports?page=X&limit=Y
  async getTransports(page = 1, limit = 10) {
    const response = await api.get<Transport[]>("/transports", {
      params: { page, limit },
    })
    return response.data
  },

  // GET /transports/:id
  async getTransportById(id: string) {
    const response = await api.get<Transport>(`/transports/${id}`)
    return response.data
  },

  // POST /transports
  async createTransport(data: CreateTransportDto) {
    const response = await api.post<Transport>("/transports", data)
    return response.data
  },

  // PATCH /transports/:id
  async updateTransport(id: string, data: UpdateTransportDto) {
    const response = await api.patch<Transport>(`/transports/${id}`, data)
    return response.data
  },

  // DELETE /transports/:id
  async deleteTransport(id: string) {
    const response = await api.delete<{ message: string }>(`/transports/${id}`)
    return response.data
  },
}
