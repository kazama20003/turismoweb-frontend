import type React from "react"
import type { Metadata } from "next"
import { generateLocaleSEO } from "@/lib/seo/seo-config"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { I18nProvider } from "@/lib/i18n/context"
import { Suspense } from "react"
import { loadLocaleData } from "@/lib/i18n/get-locale-data"
import { QueryProvider } from "@/components/providers/query-provider"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// SEO dinámico por idioma
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const validLocale: Locale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  return generateLocaleSEO(validLocale, "home")
}

// Layout que agrega providers por idioma
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params
  const validLocale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : defaultLocale

  // carga de diccionario + datos del idioma
  const { dictionary } = await loadLocaleData(validLocale)

  return (
    <QueryProvider>
      <I18nProvider key={validLocale} locale={validLocale} dictionary={dictionary}>
      <Suspense fallback={null}>{children}</Suspense>
    </I18nProvider>
    </QueryProvider>
  )
}
