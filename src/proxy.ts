import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/auth";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";

const publicRoutes = ["/login", "/register", "/forgot-password"];

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split("/");
  return isValidLocale(segments[1]) ? segments[1] : null;
}

function getPathWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return locale ? pathname.replace(`/${locale}`, "") || "/" : pathname;
}

// --------------------------------------------------------------------------------------
// DEFAULT EXPORT - requerido por Next.js
// --------------------------------------------------------------------------------------
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return;
  }

  const locale = getLocaleFromPathname(pathname);
  const pathNoLocale = getPathWithoutLocale(pathname);

  // --------------------------------------------------------------------
  // FIX: Evitar loop /es -> /es/ -> /es
  // --------------------------------------------------------------------
  if (locale && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
    return;
  }

  // --------------------------------------------------------------------
  // Redirección si NO hay locale
  // --------------------------------------------------------------------
  if (!locale) {
    let chosenLocale = defaultLocale;
    const langHeader = request.headers.get("accept-language");

    if (langHeader) {
      const preferred = langHeader.split(",")[0].split("-")[0];
      if (isValidLocale(preferred)) chosenLocale = preferred;
    }

    return NextResponse.redirect(
      new URL(`/${chosenLocale}${pathname}`, request.url)
    );
  }

  // --------------------------------------------------------------------
  // Public routes: login/register/forgot-password
  // --------------------------------------------------------------------
  const token = request.cookies.get("token")?.value;
  const isPublic = publicRoutes.some((r) => pathNoLocale.startsWith(r));

  if (isPublic) {
    if (token) {
      const payload = decodeJwtPayload(token);

      if (payload?.roles) {
        const roles = payload.roles as UserRole[];

        // CLIENT → /users/profile
        if (
          roles.includes(UserRole.CLIENT) &&
          !roles.some((r) =>
            [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
          )
        ) {
          return NextResponse.redirect(
            new URL(`/${locale}/users/profile`, request.url)
          );
        }

        // ADMIN/EDITOR/SUPPORT → /dashboard
        if (
          roles.some((r) =>
            [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
          )
        ) {
          return NextResponse.redirect(
            new URL(`/${locale}/dashboard`, request.url)
          );
        }
      }
    }
    return;
  }

  // --------------------------------------------------------------------
  // Protected routes
  // --------------------------------------------------------------------
  const isProtected =
    pathNoLocale.startsWith("/dashboard") ||
    pathNoLocale.startsWith("/users");

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }

    // Token expired
    if (Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
      response.cookies.delete("token");
      return response;
    }

    const roles = payload.roles as UserRole[];

    // CLIENT intentando entrar al dashboard
    if (
      pathNoLocale.startsWith("/dashboard") &&
      roles.includes(UserRole.CLIENT) &&
      !roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      )
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/users/profile`, request.url)
      );
    }

    // ADMIN intentando entrar a profile de usuario
    if (
      pathNoLocale.startsWith("/users/profile") &&
      roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      ) &&
      !roles.includes(UserRole.CLIENT)
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url)
      );
    }
  }

  return;
}

// --------------------------------------------------------------------------------------
// MATCHER
// --------------------------------------------------------------------------------------
export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
