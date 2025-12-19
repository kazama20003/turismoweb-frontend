// src/app/[locale]/layout.tsx
import type React from "react"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { loadLocaleData } from "@/lib/i18n/get-locale-data"

// -------------------------------------------------------
// LAYOUT PRINCIPAL (NO ASYNC, RECIBE params COMO PROMISE)
// -------------------------------------------------------
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  // 👇 Clave: Next está tipando params como Promise<{ locale: string }>
  params: Promise<{ locale: string }>
}) {
  return (
    <LocaleLayoutContentWrapper params={params}>
      {children}
    </LocaleLayoutContentWrapper>
  )
}

// -------------------------------------------------------
// COMPONENTE SERVER ASYNC (PERMITIDO)
// -------------------------------------------------------
async function LocaleLayoutContentWrapper({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Next nos da params como Promise, aquí sí podemos hacer await
  const { locale: rawLocale } = await params

  // Normalizamos/validamos el locale y obtenemos el diccionario
  const { locale, dictionary } = await loadLocaleData(rawLocale)

  return (
    <html lang={locale}>
      <body>
        <QueryProvider>
          <I18nProvider
            key={locale}
            locale={locale} // <- tipo Locale, validado dentro de loadLocaleData
            dictionary={dictionary}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </I18nProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
