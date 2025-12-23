"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/auth-service"
import { useRouter } from "next/navigation"
import type { UpdateUserDto } from "@/types/user"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterDto {
  firstName: string
  lastName: string
  email: string
  password: string
  authProvider?: "LOCAL" | "GOOGLE" | "FACEBOOK"
  country?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
  avatar?: string
}

const PROFILE_KEY = "auth-profile"

// Hook para login local
export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return authService.loginLocal(credentials)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      router.push("/dashboard")
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// Hook para registro local
export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (credentials: RegisterDto) => {
      const registerData = {
        ...credentials,
        authProvider: "LOCAL" as const,
      }
      return authService.register(registerData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      router.push("/dashboard")
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// Hook para logout
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      await authService.logout()
    },
    onSuccess: () => {
      queryClient.setQueryData([PROFILE_KEY], null)
      router.push("/login")
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useOAuthCallback() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      // Backend already set the JWT cookie during OAuth flow
      // Just fetch the profile to validate the session
      return authService.getProfile()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      router.push("/dashboard")
    },
    onError: () => {
      router.push("/login?error=oauth_failed")
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useProfile() {
  const query = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: () => authService.getProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    ...query,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      return authService.updateProfile(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}
