// src/app/[locale]/layout.tsx
import type React from "react"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { loadLocaleData } from "@/lib/i18n/get-locale-data"
import "../globals.css"

import { Poppins } from "next/font/google"

// Fuente Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// -------------------------------------------------------
// LAYOUT PRINCIPAL (NO ASYNC, RECIBE params COMO PROMISE)
// -------------------------------------------------------
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
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
  const { locale: rawLocale } = await params

  // Carga de diccionario + validación de locale
  const { locale, dictionary } = await loadLocaleData(rawLocale)

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} font-sans`}>
        <QueryProvider>
          <I18nProvider key={locale} locale={locale} dictionary={dictionary}>
            <Suspense fallback={null}>{children}</Suspense>
          </I18nProvider>

          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
