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
  const potentialLocale = segments[1];
  return isValidLocale(potentialLocale) ? potentialLocale : null;
}

function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, "") || "/";
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  // ------------------------------------------------------------------------------------------------
  // FIX: PREVENIR BUCLE CUANDO YA ESTÁS EN /es o /es/
  // ------------------------------------------------------------------------------------------------
  if (pathnameLocale) {
    if (
      pathname === `/${pathnameLocale}` ||
      pathname === `/${pathnameLocale}/`
    ) {
      return NextResponse.next();
    }
  }

  if (!pathnameLocale) {
    const acceptLanguage = request.headers.get("accept-language");
    let locale = defaultLocale;

    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
      if (isValidLocale(preferredLocale)) {
        locale = preferredLocale;
      }
    }

    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  const token = request.cookies.get("token")?.value;

  // PUBLIC ROUTES
  const isPublicRoute = publicRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isPublicRoute) {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.roles) {
        const roles = payload.roles as UserRole[];

        // CLIENT → /users/profile
        if (
          roles.includes(UserRole.CLIENT) &&
          !roles.some((r) =>
            [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
          )
        ) {
          return NextResponse.redirect(
            new URL(`/${pathnameLocale}/users/profile`, request.url)
          );
        }

        // ADMIN / SUPPORT / EDITOR → /dashboard
        if (
          roles.some((r) =>
            [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
          )
        ) {
          return NextResponse.redirect(
            new URL(`/${pathnameLocale}/dashboard`, request.url)
          );
        }
      }
    }
    return NextResponse.next();
  }

  // PROTECTED ROUTES
  const isProtectedRoute =
    pathnameWithoutLocale.startsWith("/dashboard") ||
    pathnameWithoutLocale.startsWith("/users");

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, request.url)
      );
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, request.url)
      );
    }

    // Token expired
    if (Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, request.url)
      );
      response.cookies.delete("token");
      return response;
    }

    const roles = payload.roles as UserRole[];

    // CLIENT intentando entrar a dashboard
    if (pathnameWithoutLocale.startsWith("/dashboard")) {
      if (
        roles.includes(UserRole.CLIENT) &&
        !roles.some((r) =>
          [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
        )
      ) {
        return NextResponse.redirect(
          new URL(`/${pathnameLocale}/users/profile`, request.url)
        );
      }
    }

    // ADMIN intentando entrar a /users/profile
    if (pathnameWithoutLocale.startsWith("/users/profile")) {
      if (
        roles.some((r) =>
          [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
        ) &&
        !roles.includes(UserRole.CLIENT)
      ) {
        return NextResponse.redirect(
          new URL(`/${pathnameLocale}/dashboard`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
