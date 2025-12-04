import { api } from "@/lib/api"
import type { Order, CreateOrderDto, UpdateOrderDto, PaginatedResponse } from "@/types/order"

export const ordersService = {
  // GET /orders?page=X&limit=Y
  async getOrders(page = 1, limit = 10) {
    const response = await api.get<PaginatedResponse<Order>>("/orders", {
      params: { page, limit },
    })
    return response.data
  },

  // GET /orders/:id
  async getOrderById(id: string) {
    const response = await api.get<Order>(`/orders/${id}`)
    return response.data
  },

  // POST /orders
  async createOrder(data: CreateOrderDto) {
    const response = await api.post<Order>("/orders", data)
    return response.data
  },

  // PATCH /orders/:id
  async updateOrder(id: string, data: UpdateOrderDto) {
    const response = await api.patch<Order>(`/orders/${id}`, data)
    return response.data
  },

  // DELETE /orders/:id
  async deleteOrder(id: string) {
    const response = await api.delete<{ message: string }>(`/orders/${id}`)
    return response.data
  },

  // GET /orders/code/:code
  async getOrderByCode(code: string) {
    const response = await api.get<Order>(`/orders/code/${code}`)
    return response.data
  },
}
