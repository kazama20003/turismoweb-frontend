import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { UserRole } from "@/types/auth";

// PUBLIC ROUTES
const publicRoutes = ["/login", "/register", "/forgot-password"];

// ---------------------------------------------------------------------
// Tipado seguro del payload del JWT
// ---------------------------------------------------------------------
interface JwtPayload {
  exp?: number;
  roles?: UserRole[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------
// EDGE-SAFE JWT decoding
// ---------------------------------------------------------------------
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------
// Locale helpers
// ---------------------------------------------------------------------
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/");
  return isValidLocale(segments[1]) ? segments[1] : null;
}

function getPathWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  return locale ? pathname.replace(`/${locale}`, "") || "/" : pathname;
}

// ---------------------------------------------------------------------
// COOKIE DELETE OPTIONS (DEBEN COINCIDIR CON EL BACKEND)
// ---------------------------------------------------------------------
const COOKIE_DELETE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  domain: ".tawantinsuyoperu.com",
  maxAge: 0,
};

// ---------------------------------------------------------------------
// MAIN MIDDLEWARE
// ---------------------------------------------------------------------
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // IGNORAR rutas de sistema
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const locale = getLocaleFromPath(pathname);
  const pathNoLocale = getPathWithoutLocale(pathname);

  // FIX evitar loop /es ↔ /es/
  if (locale && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
    return NextResponse.next();
  }

  // SIN LOCALE → asignar automáticamente
  if (!locale) {
    let chosen = defaultLocale;

    const langHeader = request.headers.get("accept-language");
    if (langHeader) {
      const preferred = langHeader.split(",")[0].split("-")[0];
      if (isValidLocale(preferred)) chosen = preferred;
    }

    const redirectUrl = new URL(`/${chosen}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ---------------------------------------------------------------------
  // TOKEN HANDLING
  // ---------------------------------------------------------------------
  const token = request.cookies.get("token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  // TOKEN INVÁLIDO (no decodifica)
  if (token && !payload) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));

    response.cookies.set("token", "", COOKIE_DELETE_OPTIONS);

    return response;
  }

  // TOKEN EXPIRADO
  if (payload?.exp && Date.now() >= payload.exp * 1000) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));

    response.cookies.set("token", "", COOKIE_DELETE_OPTIONS);

    return response;
  }

  const roles: UserRole[] = Array.isArray(payload?.roles)
    ? (payload?.roles as UserRole[])
    : [];

  // ---------------------------------------------------------------------
  // PUBLIC ROUTES
  // ---------------------------------------------------------------------
  if (publicRoutes.some((r) => pathNoLocale.startsWith(r))) {
    if (!payload) return NextResponse.next();

    // CLIENT → users/profile
    if (
      roles.includes(UserRole.CLIENT) &&
      !roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      )
    ) {
      return NextResponse.redirect(new URL(`/${locale}/users/profile`, request.url));
    }

    // ADMIN / SUPPORT / EDITOR → dashboard
    if (
      roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      )
    ) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    return NextResponse.next();
  }

  // ---------------------------------------------------------------------
  // PROTECTED ROUTES
  // ---------------------------------------------------------------------
  const isProtected =
    pathNoLocale.startsWith("/dashboard") ||
    pathNoLocale.startsWith("/users");

  if (isProtected) {
    if (!token || !payload) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // CLIENT intenta entrar al dashboard
    if (pathNoLocale.startsWith("/dashboard") && roles.includes(UserRole.CLIENT)) {
      return NextResponse.redirect(new URL(`/${locale}/users/profile`, request.url));
    }

    // ADMIN/EDITOR/SUPPORT entrando a users/profile sin ser CLIENT
    if (
      pathNoLocale.startsWith("/users/profile") &&
      roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      ) &&
      !roles.includes(UserRole.CLIENT)
    ) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------
// MATCHER
// ---------------------------------------------------------------------
export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
