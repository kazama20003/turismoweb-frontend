"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "@/services/users-service"
import type { CreateUserDto, UpdateUserDto } from "@/types/user"

const USERS_KEY = "users-list"

// Hook para obtener usuarios paginados
export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [USERS_KEY, page, limit],
    queryFn: () => usersService.getUsers(page, limit),
  })
}

// Hook para obtener un usuario por ID
export function useUser(id: string | null) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersService.getUserById(id!),
    enabled: !!id,
  })
}

// Hook para obtener un usuario por email
export function useUserByEmail(email: string | null) {
  return useQuery({
    queryKey: ["user-by-email", email],
    queryFn: () => usersService.getUserByEmail(email!),
    enabled: !!email,
  })
}

// CREATE USER
export function useCreateUser() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateUserDto) => {
      return usersService.createUser(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// UPDATE USER
export function useUpdateUser() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      return usersService.updateUser(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// DELETE USER
export function useDeleteUser() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return usersService.deleteUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// Función helper para fetch directo (sin hook)
export async function fetchUserByEmail(email: string) {
  return usersService.getUserByEmail(email)
}
