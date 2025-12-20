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

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const locale = getLocaleFromPathname(pathname);
  const pathNoLocale = getPathWithoutLocale(pathname);

  // --------------------------------------------------------------------
  // FIX REAL DEL LOOP /es ↔ /es/
  // --------------------------------------------------------------------
  if (locale) {
    const normalized = `/${locale}/`;

    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      if (pathname !== normalized) {
        url.pathname = normalized;
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
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

    url.pathname = `/${chosenLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // --------------------------------------------------------------------
  // Public routes
  // --------------------------------------------------------------------
  const token = request.cookies.get("token")?.value;
  const isPublic = publicRoutes.some((r) => pathNoLocale.startsWith(r));

  if (isPublic) {
    if (token) {
      const payload = decodeJwtPayload(token);

      if (!payload) {
        const response = NextResponse.redirect(`/${locale}/login`);
        response.cookies.delete("token");
        return response;
      }

      const roles = payload.roles as UserRole[];

      if (
        roles.includes(UserRole.CLIENT) &&
        !roles.some((r) =>
          [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
        )
      ) {
        url.pathname = `/${locale}/users/profile`;
        return NextResponse.redirect(url);
      }

      if (
        roles.some((r) =>
          [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
        )
      ) {
        url.pathname = `/${locale}/dashboard`;
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  // --------------------------------------------------------------------
  // Protected routes
  // --------------------------------------------------------------------
  const isProtected =
    pathNoLocale.startsWith("/dashboard") ||
    pathNoLocale.startsWith("/users");

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(`/${locale}/login`);
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
      const response = NextResponse.redirect(`/${locale}/login`);
      response.cookies.delete("token");
      return response;
    }

    if (Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(`/${locale}/login`);
      response.cookies.delete("token");
      return response;
    }

    const roles = payload.roles as UserRole[];

    if (
      pathNoLocale.startsWith("/dashboard") &&
      roles.includes(UserRole.CLIENT) &&
      !roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      )
    ) {
      url.pathname = `/${locale}/users/profile`;
      return NextResponse.redirect(url);
    }

    if (
      pathNoLocale.startsWith("/users/profile") &&
      roles.some((r) =>
        [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
      ) &&
      !roles.includes(UserRole.CLIENT)
    ) {
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
