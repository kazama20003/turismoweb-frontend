import type React from "react"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { loadLocaleData, type LocaleData } from "@/lib/i18n/get-locale-data"

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // No usamos "as", dejamos que TypeScript infiera
  const dataPromise = loadLocaleData(params.locale)

  return (
    <LocaleLayoutContent dataPromise={dataPromise}>
      {children}
    </LocaleLayoutContent>
  )
}

async function LocaleLayoutContent({
  dataPromise,
  children,
}: {
  dataPromise: Promise<LocaleData>
  children: React.ReactNode
}) {
  const { locale, dictionary } = await dataPromise

  return (
    <html lang={locale}>
      <body>
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
