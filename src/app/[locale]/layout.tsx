import type React from "react"
import type { Metadata } from "next"
import { generateLocaleSEO } from "@/lib/seo/seo-config"
import { locales, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { I18nProvider } from "@/lib/i18n/context"
import { Suspense } from "react"
import { loadLocaleData } from "@/lib/i18n/get-locale-data"
import { QueryProvider } from "@/components/providers/query-provider"
import { notFound } from "next/navigation"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// SEO dinamico por idioma
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const validLocale: Locale = isValidLocale(locale) ? locale : defaultLocale
  return generateLocaleSEO(validLocale, "home")
}

// Layout que agrega providers por idioma
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const validLocale: Locale = rawLocale

  // Carga de diccionario + datos del idioma
  const { dictionary } = await loadLocaleData(validLocale)

  return (
    <QueryProvider>
      <I18nProvider key={validLocale} locale={validLocale} dictionary={dictionary}>
        <Suspense fallback={null}>{children}</Suspense>
      </I18nProvider>
    </QueryProvider>
  )
}
