"use client"

import { useRouter } from "next/navigation"
import { usePost } from "./use-api"
import { decodeToken, getRedirectByRole } from "@/lib/utils"
import { authService } from "@/services/auth-service"
import type { AuthResponse, LoginCredentials, LocalRegisterCredentials } from "@/types/auth"
import type { CreateUserDto } from "@/types/user"
import { AuthProvider } from "@/types/user"
import { usePathname } from "next/navigation"
import { resolveLocale } from "@/lib/i18n/config"

export function useLogin() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = resolveLocale(pathname.split("/")[1])

  return usePost<AuthResponse, LoginCredentials>("/auth/login/local", {
    onSuccess: (data) => {
      const payload = decodeToken(data.access_token)
      if (payload) {
        router.push(`/${locale}${getRedirectByRole(payload.roles)}`)
      }
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = resolveLocale(pathname.split("/")[1])

  const mutation = usePost<AuthResponse, CreateUserDto>("/auth/register", {
    onSuccess: (data) => {
      const payload = decodeToken(data.access_token)
      if (payload) {
        router.push(`/${locale}${getRedirectByRole(payload.roles)}`)
      }
    },
  })

  return {
    ...mutation,
    register: (credentials: LocalRegisterCredentials) => {
      const dto: CreateUserDto = {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
        authProvider: AuthProvider.LOCAL,
      }

      return mutation.mutate(dto)
    },
  }
}

export function getOAuthRedirectUrl(provider: "google" | "facebook"): string {
  if (provider === "google") {
    return authService.getGoogleAuthUrl()
  }
  return authService.getFacebookAuthUrl()
}
