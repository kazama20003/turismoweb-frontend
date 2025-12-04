import { api } from "@/lib/api"
import type { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from "@/types/user"

export const usersService = {
  // GET /users?page=X&limit=Y
  async getUsers(page = 1, limit = 10) {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params: { page, limit },
    })
    return response.data
  },

  // GET /users/:id
  async getUserById(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  // POST /users
  async createUser(data: CreateUserDto) {
    const response = await api.post<User>("/users", data)
    return response.data
  },

  // PATCH /users/:id
  async updateUser(id: string, data: UpdateUserDto) {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
  },

  // DELETE /users/:id
  async deleteUser(id: string) {
    const response = await api.delete<{ message: string }>(`/users/${id}`)
    return response.data
  },

  // GET /users?email=X
  async getUserByEmail(email: string) {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params: { email },
    })
    // Return first user found or null
    return response.data.data?.[0] || null
  },
}
