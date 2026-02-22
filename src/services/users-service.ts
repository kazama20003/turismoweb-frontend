import { api } from "@/lib/api"
import { UserRole, type User, type CreateUserDto, type UpdateUserDto, type PaginatedResponse } from "@/types/user"

type SingleUserResponse = unknown

function isUserLike(value: unknown): value is User {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<User>
  return typeof candidate._id === "string" || typeof candidate.id === "string"
}

function matchesUserId(user: User, id: string) {
  return user._id === id || user.id === id
}

function findUserInPayload(payload: unknown, id: string, depth = 0): User | null {
  if (depth > 8 || payload == null) return null

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findUserInPayload(item, id, depth + 1)
      if (found) return found
    }
    return null
  }

  if (isUserLike(payload)) return matchesUserId(payload, id) ? payload : null
  if (typeof payload !== "object") return null

  const record = payload as Record<string, unknown>
  const priorityKeys = ["data", "user", "result", "item"]

  for (const key of priorityKeys) {
    if (!(key in record)) continue
    const found = findUserInPayload(record[key], id, depth + 1)
    if (found) return found
  }

  for (const value of Object.values(record)) {
    const found = findUserInPayload(value, id, depth + 1)
    if (found) return found
  }

  return null
}

function findUserByEmailInPayload(payload: unknown, email: string, depth = 0): User | null {
  if (depth > 8 || payload == null) return null

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findUserByEmailInPayload(item, email, depth + 1)
      if (found) return found
    }
    return null
  }

  if (isUserLike(payload)) return payload.email?.toLowerCase() === email.toLowerCase() ? payload : null
  if (typeof payload !== "object") return null

  const record = payload as Record<string, unknown>
  const priorityKeys = ["data", "user", "result", "item"]

  for (const key of priorityKeys) {
    if (!(key in record)) continue
    const found = findUserByEmailInPayload(record[key], email, depth + 1)
    if (found) return found
  }

  for (const value of Object.values(record)) {
    const found = findUserByEmailInPayload(value, email, depth + 1)
    if (found) return found
  }

  return null
}

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
    const response = await api.get<SingleUserResponse>(`/users/${id}`)
    const foundUser = findUserInPayload(response.data, id)
    if (!foundUser) {
      throw new Error("No se pudo resolver el usuario solicitado")
    }

    if (!Array.isArray(foundUser.roles) || foundUser.roles.length === 0) {
      try {
        const byEmailResponse = await api.get<SingleUserResponse>("/users", {
          params: { email: foundUser.email },
        })
        const enrichedUser =
          findUserInPayload(byEmailResponse.data, id) ??
          findUserByEmailInPayload(byEmailResponse.data, foundUser.email)
        if (enrichedUser && Array.isArray(enrichedUser.roles) && enrichedUser.roles.length > 0) {
          return { ...foundUser, roles: enrichedUser.roles }
        }
      } catch {
        // keep original user if enrichment fails
      }
    }

    return foundUser
  },

  // POST /users
  async createUser(data: CreateUserDto) {
    const response = await api.post<User>("/users", data)
    return response.data
  },

  // PATCH /users/:id
  async updateUser(id: string, data: UpdateUserDto) {
    const validRoles = new Set<string>(Object.values(UserRole))
    const payload: UpdateUserDto = { ...data }

    if (Array.isArray(data.roles)) {
      const normalizedRoles = data.roles
        .map((role) => (typeof role === "string" ? role.trim().toUpperCase() : ""))
        .map((role) => (role === "USER" ? UserRole.CLIENT : role))
        .filter((role): role is UserRole => validRoles.has(role))

      payload.roles = normalizedRoles.length > 0 ? normalizedRoles : undefined
    }

    const response = await api.patch<User>(`/users/${id}`, payload)
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
