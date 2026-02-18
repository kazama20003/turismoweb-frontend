import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";

const publicRoutes = ["/login", "/register", "/forgot-password"];

interface JwtPayload {
  iat?: number;
  exp?: number;
  roles?: unknown;
  role?: unknown;
  [key: string]: unknown;
}

const ADMIN_PANEL_ROLES = new Set(["ADMIN", "EDITOR", "SUPPORT"]);
const CLIENT_ROLE = "CLIENT";

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    const base64Url = part.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = `${base64Url}${padding}`;
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/");
  return isValidLocale(segments[1]) ? segments[1] : null;
}

function getPathWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  return locale ? pathname.replace(`/${locale}`, "") || "/" : pathname;
}

function getPreferredLocale(request: NextRequest): string {
  const langHeader = request.headers.get("accept-language");
  if (!langHeader) return defaultLocale;
  const preferred = langHeader.split(",")[0].split("-")[0];
  return isValidLocale(preferred) ? preferred : defaultLocale;
}

function normalizeToken(rawToken: string): string {
  const decoded = decodeURIComponent(rawToken).trim().replace(/^"|"$/g, "");
  const unprefixed = decoded.replace(/^bearer\s+/i, "").replace(/^s:/i, "");
  const jwtMatch = unprefixed.match(/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/);
  return (jwtMatch?.[0] || unprefixed).trim();
}

function extractRequestAuth(request: NextRequest): {
  token: string | null;
  payload: JwtPayload | null;
  hadTokenCandidate: boolean;
} {
  const serverCookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerCandidate = authHeader?.startsWith("Bearer ") ? authHeader : null;

  const rawCandidates = [serverCookieToken, headerCandidate].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  for (const rawCandidate of rawCandidates) {
    const candidate = normalizeToken(rawCandidate);
    if (!candidate) continue;
    const payload = decodeJwtPayload(candidate);
    if (payload) {
      return { token: candidate, payload, hadTokenCandidate: true };
    }
  }

  return { token: null, payload: null, hadTokenCandidate: rawCandidates.length > 0 };
}

function getCookieDeleteOptions(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const isProdHost =
    hostname === "tawantinsuyoperu.com" || hostname.endsWith(".tawantinsuyoperu.com");

  return {
    httpOnly: true,
    secure: isProdHost,
    sameSite: (isProdHost ? "none" : "lax") as "none" | "lax",
    path: "/",
    ...(isProdHost ? { domain: ".tawantinsuyoperu.com" } : {}),
    maxAge: 0,
  };
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}${search}`, request.url));
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}${search}`, request.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && !isValidLocale(firstSegment)) {
    const chosen = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${chosen}${pathname}${search}`, request.url));
  }

  const locale = getLocaleFromPath(pathname);
  const pathNoLocale = getPathWithoutLocale(pathname);
  const effectiveLocale = locale ?? getPreferredLocale(request);

  if (!locale) {
    const chosen = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${chosen}${pathname}${search}`, request.url));
  }

  if (pathname === `/${locale}` || pathname === `/${locale}/`) {
    return NextResponse.next();
  }

  const { token, payload, hadTokenCandidate } = extractRequestAuth(request);
  const COOKIE_DELETE_OPTIONS = getCookieDeleteOptions(request);

  if (hadTokenCandidate && !payload) {
    const res = NextResponse.redirect(new URL(`/${effectiveLocale}/login`, request.url));
    res.cookies.set("auth_token", "", COOKIE_DELETE_OPTIONS);
    res.cookies.set("token", "", COOKIE_DELETE_OPTIONS);
    return res;
  }

  if (payload?.exp && Date.now() >= payload.exp * 1000) {
    const res = NextResponse.redirect(new URL(`/${effectiveLocale}/login`, request.url));
    res.cookies.set("auth_token", "", COOKIE_DELETE_OPTIONS);
    res.cookies.set("token", "", COOKIE_DELETE_OPTIONS);
    return res;
  }

  const rolesFromArray = Array.isArray(payload?.roles)
    ? payload.roles
        .map((role) => (typeof role === "string" ? role.toUpperCase() : ""))
        .filter((role) => role.length > 0)
    : [];
  const roleFromSingle = typeof payload?.role === "string" ? [payload.role.toUpperCase()] : [];
  const roles: string[] = Array.from(new Set([...rolesFromArray, ...roleFromSingle]));
  const hasAdminPanelRole = roles.some((role) => ADMIN_PANEL_ROLES.has(role));
  const hasClientRole = roles.includes(CLIENT_ROLE);

  const isDashboardPath =
    pathname === `/${effectiveLocale}/dashboard` || pathname.startsWith(`/${effectiveLocale}/dashboard/`);
  const isUsersPath =
    pathname === `/${effectiveLocale}/users` || pathname.startsWith(`/${effectiveLocale}/users/`);

  if (publicRoutes.some((r) => pathNoLocale.startsWith(r))) {
    if (!token || !payload) return NextResponse.next();
    if (hasAdminPanelRole) {
      return NextResponse.redirect(new URL(`/${effectiveLocale}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL(`/${effectiveLocale}/users/profile`, request.url));
  }

  const isProtected = isDashboardPath || isUsersPath;
  if (isProtected) {
    if (!token || !payload) {
      return NextResponse.redirect(new URL(`/${effectiveLocale}/login`, request.url));
    }

    if (isDashboardPath && !hasAdminPanelRole) {
      return NextResponse.redirect(new URL(`/${effectiveLocale}/users/profile`, request.url));
    }

    if (isUsersPath && !hasClientRole) {
      return NextResponse.redirect(new URL(`/${effectiveLocale}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!_next|api|favicon|.*\\..*).*)"],
};
