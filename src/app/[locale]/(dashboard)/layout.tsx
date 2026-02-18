import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { resolveLocale } from "@/lib/i18n/config"
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const ADMIN_PANEL_ROLES = new Set(["ADMIN", "EDITOR", "SUPPORT"])

interface JwtPayload {
  exp?: number
  roles?: unknown
  role?: unknown
}

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function normalizeToken(rawToken: string): string {
  const decoded = decodeURIComponent(rawToken).trim().replace(/^"|"$/g, "")
  const unprefixed = decoded.replace(/^bearer\s+/i, "").replace(/^s:/i, "")
  const jwtMatch = unprefixed.match(/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/)
  return (jwtMatch?.[0] || unprefixed).trim()
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1]
    if (!part) return null
    const base64Url = part.replace(/-/g, "+").replace(/_/g, "/")
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4)
    const json = Buffer.from(`${base64Url}${padding}`, "base64").toString("utf8")
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

function getRoles(payload: JwtPayload | null): string[] {
  if (!payload) return []
  const rolesFromArray = Array.isArray(payload.roles)
    ? payload.roles.map((role) => (typeof role === "string" ? role.toUpperCase() : ""))
    : []
  const roleFromSingle = typeof payload.role === "string" ? [payload.role.toUpperCase()] : []
  return Array.from(new Set([...rolesFromArray, ...roleFromSingle])).filter(Boolean)
}

export default async function DashboardLayout({ children, params }: Readonly<DashboardLayoutProps>) {
  const { locale: rawLocale } = await params
  const locale = resolveLocale(rawLocale)

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get("token")?.value
  if (!tokenCookie) {
    redirect(`/${locale}/login`)
  }

  const payload = decodeJwtPayload(normalizeToken(tokenCookie))
  if (!payload?.exp || Date.now() >= payload.exp * 1000) {
    redirect(`/${locale}/login`)
  }

  const roles = getRoles(payload)
  const hasAdminRole = roles.some((role) => ADMIN_PANEL_ROLES.has(role))
  if (!hasAdminRole) {
    redirect(`/${locale}/users/profile`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  )
}
