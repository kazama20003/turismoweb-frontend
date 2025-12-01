import { api } from "@/lib/api"
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto, PaginatedResponse } from "@/types/vehicle"

export const vehiclesService = {
  // GET /vehicle?page=X&limit=Y
  async getVehicles(page = 1, limit = 10) {
    const response = await api.get<PaginatedResponse<Vehicle>>("/vehicle", {
      params: { page, limit },
    })
    return response.data
  },

  // GET /vehicle/:id
  async getVehicleById(id: string) {
    const response = await api.get<Vehicle>(`/vehicle/${id}`)
    return response.data
  },

  // POST /vehicle
  async createVehicle(data: CreateVehicleDto) {
    const response = await api.post<Vehicle>("/vehicle", data)
    return response.data
  },

  // PATCH /vehicle/:id
  async updateVehicle(id: string, data: UpdateVehicleDto) {
    const response = await api.patch<Vehicle>(`/vehicle/${id}`, data)
    return response.data
  },

  // DELETE /vehicle/:id
  async deleteVehicle(id: string) {
    const response = await api.delete<{ message: string }>(`/vehicle/${id}`)
    return response.data
  },
}
  