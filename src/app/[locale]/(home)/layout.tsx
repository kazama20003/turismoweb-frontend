"use client"

import type { ReactNode } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { CartDrawerProvider } from "@/contexts/cart-context"

interface HomeLayoutProps {
  children: ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const params = useParams()

  const rawLocale =
    typeof params?.locale === "string"
      ? params.locale
      : Array.isArray(params?.locale)
      ? params.locale[0]
      : undefined

  const locale: Locale = isValidLocale(rawLocale)
    ? rawLocale
    : defaultLocale

  return (
    <CartDrawerProvider>
      <Header />
      {children}
      <Footer locale={locale} />
    </CartDrawerProvider>
  )
}
