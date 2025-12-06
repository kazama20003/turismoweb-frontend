"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { Footer } from "@/components/home/footer"
import Header from "@/components/home/header"
import { isValidLocale, type Locale, defaultLocale } from "@/lib/i18n/config"

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams()

  const rawLocale =
    typeof params?.locale === "string"
      ? params.locale
      : Array.isArray(params?.locale)
      ? params.locale[0]
      : undefined

  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale

  return (
    <>
      <Header />
      {children}
      <Footer locale={locale} />
    </>
  )
}
