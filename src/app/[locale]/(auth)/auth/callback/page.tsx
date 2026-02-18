"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { resolveLocale } from "@/lib/i18n/config"
import { authService } from "@/services/auth-service"
import type { User } from "@/types/user"

export default function AuthCallback() {
  const router = useRouter()
  const pathname = usePathname()
  const localeFromPath = resolveLocale(pathname.split("/")[1])

  useEffect(() => {
    const localeFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("oauth_locale") : null
    const locale = resolveLocale(localeFromStorage ?? localeFromPath)

    authService
      .getProfile()
      .then((user: User) => {
        const roles = Array.isArray(user?.roles)
          ? user.roles.map((role) => (typeof role === "string" ? role.toUpperCase() : ""))
          : []
        const hasAdminRole = roles.some((role) => ["ADMIN", "EDITOR", "SUPPORT"].includes(role))

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("oauth_locale")
        }
        router.replace(hasAdminRole ? `/${locale}/dashboard` : `/${locale}/users/profile`)
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("oauth_locale")
        }
        router.replace(`/${locale}/login`)
      })
  }, [localeFromPath, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Validando autenticacion...</h2>
    </div>
  )
}
