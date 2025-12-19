import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, isValidLocale, defaultLocale } from "@/lib/i18n/config"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Tourism & Transport Dashboard",
  description: "Manage your tourism and transportation services",
  generator: "Phoenix Solutions IT",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const localeParam = params.locale

  const locale: Locale = isValidLocale(localeParam)
    ? localeParam
    : defaultLocale

  const dictionary = await getDictionary(locale)

  return (
    <html lang={locale}>
      <body className={`font-sans ${poppins.variable}`}>
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
