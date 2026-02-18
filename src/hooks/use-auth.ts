"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/auth-service"
import { usePathname, useRouter } from "next/navigation"
import type { UpdateUserDto } from "@/types/user"
import { resolveLocale } from "@/lib/i18n/config"

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
const ADMIN_PANEL_ROLES = new Set(["ADMIN", "EDITOR", "SUPPORT"])

function getRedirectByRoles(roles: unknown): "/dashboard" | "/users/profile" {
  const normalizedRoles = Array.isArray(roles)
    ? roles.map((role) => (typeof role === "string" ? role.toUpperCase() : "")).filter(Boolean)
    : []
  const hasAdminRole = normalizedRoles.some((role) => ADMIN_PANEL_ROLES.has(role))
  return hasAdminRole ? "/dashboard" : "/users/profile"
}

// Hook para login local
export function useLogin() {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const locale = resolveLocale(pathname.split("/")[1])

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return authService.loginLocal(credentials)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      const target = getRedirectByRoles(data?.user?.roles)
      router.push(`/${locale}${target}`)
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
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const locale = resolveLocale(pathname.split("/")[1])

  const mutation = useMutation({
    mutationFn: async (credentials: RegisterDto) => {
      const registerData = {
        ...credentials,
        authProvider: "LOCAL" as const,
      }
      return authService.register(registerData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      const target = getRedirectByRoles(data?.user?.roles)
      router.push(`/${locale}${target}`)
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
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const locale = resolveLocale(pathname.split("/")[1])

  const mutation = useMutation({
    mutationFn: async () => {
      await authService.logout()
    },
    onSuccess: () => {
      queryClient.setQueryData([PROFILE_KEY], null)
      router.push(`/${locale}/login`)
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
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const locale = resolveLocale(pathname.split("/")[1])

  const mutation = useMutation({
    mutationFn: async () => {
      // Backend already set the JWT cookie during OAuth flow
      // Just fetch the profile to validate the session
      return authService.getProfile()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
      router.push(`/${locale}/dashboard`)
    },
    onError: () => {
      router.push(`/${locale}/login?error=oauth_failed`)
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useProfile(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: () => authService.getProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled ?? true,
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
