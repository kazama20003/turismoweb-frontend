import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { UserRole } from "@/types/auth";

const publicRoutes = ["/login", "/register", "/forgot-password"];

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getLocaleFromPathname(pathname) {
  const segments = pathname.split("/");
  return isValidLocale(segments[1]) ? segments[1] : null;
}

function getPathWithoutLocale(pathname) {
  const locale = getLocaleFromPathname(pathname);
  return locale ? pathname.replace(`/${locale}`, "") || "/" : pathname;
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // -------------------------------
  // Skip static/system files
  // -------------------------------
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

  // -------------------------------
  // FIX: Evitar loop entre /es y /es/
  // -------------------------------
  if (locale && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
    return NextResponse.next(); // NO redirigir para evitar loop
  }

  // -------------------------------
  // Si no hay locale → agregarlo
  // -------------------------------
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

  // -------------------------------
  // PUBLIC ROUTES
  // -------------------------------
  const token = request.cookies.get("token")?.value;
  const isPublic = publicRoutes.some((r) => pathNoLocale.startsWith(r));

  if (isPublic) {
    if (token) {
      const payload = decodeJwtPayload(token);

      // Token inválido → eliminar → NO LOOP
      if (!payload || !payload.roles) {
        const response = NextResponse.redirect(`/${locale}/login`);
        response.cookies.delete("token");
        return response;
      }

      const roles = payload.roles;

      // CLIENT → /users/profile
      if (
        roles.includes(UserRole.CLIENT) &&
        !roles.some((r) =>
          [UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPPORT].includes(r)
        )
      ) {
        url.pathname = `/${locale}/users/profile`;
        return NextResponse.redirect(url);
      }

      // ADMIN / EDITOR / SUPPORT
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

  // -------------------------------
  // PROTECTED ROUTES
  // -------------------------------
  const isProtected =
    pathNoLocale.startsWith("/dashboard") ||
    pathNoLocale.startsWith("/users");

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(`/${locale}/login`);
    }

    const payload = decodeJwtPayload(token);

    // Token corrupto
    if (!payload || !payload.roles) {
      const response = NextResponse.redirect(`/${locale}/login`);
      response.cookies.delete("token");
      return response;
    }

    // Token sin exp → inválido
    if (!payload.exp) {
      const response = NextResponse.redirect(`/${locale}/login`);
      response.cookies.delete("token");
      return response;
    }

    // Token expirado
    if (Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(`/${locale}/login`);
      response.cookies.delete("token");
      return response;
    }

    const roles = payload.roles;

    // CLIENT intentando entrar a dashboard
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

    // ADMIN intentando entrar al profile
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

  // -------------------------------
  // Continuar flujo normal
  // -------------------------------
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
