import { api } from "@/lib/api"
import type { Order, CreateOrderDto, UpdateOrderDto, PaginatedResponse } from "@/types/order"

export const ordersService = {
  async getOrders(page = 1, limit = 10) {
    const response = await api.get<PaginatedResponse<Order>>("/orders", {
      params: { page, limit },
    })
    return response.data
  },

  async getOrderById(id: string) {
    const response = await api.get<Order>(`/orders/${id}`)
    return response.data
  },

  async createOrder(data: CreateOrderDto) {
    const response = await api.post<Order>("/orders", data)
    return response.data
  },

  async updateOrder(id: string, data: UpdateOrderDto) {
    const response = await api.patch<Order>(`/orders/${id}`, data)
    return response.data
  },

  async deleteOrder(id: string) {
    const response = await api.delete<{ message: string }>(`/orders/${id}`)
    return response.data
  },

  async getOrderByCode(code: string) {
    const response = await api.get<Order>(`/orders/code/${code}`)
    return response.data
  },

  async getMyOrders() {
    const response = await api.get<PaginatedResponse<Order>>("/orders/profile")
    return response.data.data // Extract the orders array from paginated response
  },
}
