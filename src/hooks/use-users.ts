"use client"

import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"
import { usersService } from "@/services/users-service"
import type { CreateUserDto, UpdateUserDto } from "@/types/user"

const USERS_KEY = "users-list"

// Fetcher for SWR
const fetchUsers = async ([, page, limit]: [string, number, number]) => {
  return usersService.getUsers(page, limit)
}

// Hook for fetching users with pagination
export function useUsers(page = 1, limit = 10) {
  return useSWR([USERS_KEY, page, limit], fetchUsers, {
    revalidateOnFocus: false,
  })
}

// Hook for fetching a single user
export function useUser(id: string | null) {
  return useSWR(id ? ["user", id] : null, async ([, userId]: [string, string]) => usersService.getUserById(userId), {
    revalidateOnFocus: false,
  })
}

export function revalidateUsers() {
  mutate((key) => Array.isArray(key) && key[0] === USERS_KEY, undefined, { revalidate: true })
}

// Hook for creating a user
export function useCreateUser() {
  return useSWRMutation("createUser", async (_, { arg }: { arg: CreateUserDto }) => {
    const result = await usersService.createUser(arg)
    revalidateUsers()
    return result
  })
}

// Hook for updating a user
export function useUpdateUser() {
  return useSWRMutation("updateUser", async (_, { arg }: { arg: { id: string; data: UpdateUserDto } }) => {
    const result = await usersService.updateUser(arg.id, arg.data)
    revalidateUsers()
    return result
  })
}

// Hook for deleting a user
export function useDeleteUser() {
  return useSWRMutation("deleteUser", async (_, { arg }: { arg: string }) => {
    const result = await usersService.deleteUser(arg)
    revalidateUsers()
    return result
  })
}

// Hook for fetching user by email
export function useUserByEmail(email: string | null) {
  return useSWR(
    email ? ["user-by-email", email] : null,
    async ([, userEmail]: [string, string]) => usersService.getUserByEmail(userEmail),
    {
      revalidateOnFocus: false,
    },
  )
}

export async function fetchUserByEmail(email: string) {
  return usersService.getUserByEmail(email)
}
