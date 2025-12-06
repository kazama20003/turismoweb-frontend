export const locales = [
  "es", // Español
  "en", // Inglés
  "fr", // Francés
  "it", // Italiano
  "de", // Alemán
  "pt", // Portugués
  "zh", // Chino
  "ja", // Japonés
  "ru", // Ruso
] as const

export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "es"

export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === "string" && locales.includes(locale as Locale)
}


export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ru: "Русский",
}
