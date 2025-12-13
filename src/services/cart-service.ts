import { api } from "@/lib/api"
import type { Cart, CreateCartDto, UpdateCartDto } from "@/types/cart"

export const cartService = {
  // POST /cart → Crea un carrito (usuario autenticado o invitado)
  createCart: async (data: CreateCartDto): Promise<Cart> => {
    const response = await api.post<Cart>("/cart", data)
    return response.data
  },

  // GET /cart → Lista todos los carritos (admin)
  getAllCarts: async (): Promise<Cart[]> => {
    const response = await api.get<Cart[]>("/cart")
    return response.data
  },

  // GET /cart/current?sessionId=XXX → Obtiene el carrito actual (por JWT o sessionId)
  getCurrentCart: async (sessionId?: string): Promise<Cart | null> => {
    try {
      const params = sessionId ? { sessionId } : {}
      const response = await api.get<Cart>("/cart/current", { params })
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 404) {
          return null
        }
      }
      throw error
    }
  },

  // GET /cart/:id → Obtiene un carrito por su ID
  getCartById: async (id: string): Promise<Cart> => {
    const response = await api.get<Cart>(`/cart/${id}`)
    return response.data
  },

  // PATCH /cart/:id → Actualiza un carrito por su ID
  updateCart: async (id: string, data: UpdateCartDto): Promise<Cart> => {
    const response = await api.patch<Cart>(`/cart/${id}`, data)
    return response.data
  },

  // DELETE /cart/:id → Elimina un carrito por su ID
  deleteCart: async (id: string): Promise<void> => {
    await api.delete(`/cart/${id}`)
  },
}
