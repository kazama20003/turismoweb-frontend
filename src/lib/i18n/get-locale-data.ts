// src/lib/i18n/get-locale-data.ts
import { getDictionary, type DictionarySchema } from "./dictionaries"
import { isValidLocale, defaultLocale, type Locale } from "./config"

export type LocaleData = {
  locale: Locale
  dictionary: DictionarySchema
}

export async function loadLocaleData(rawLocale: string): Promise<LocaleData> {
  const locale: Locale = isValidLocale(rawLocale)
    ? rawLocale
    : defaultLocale

  const dictionary = await getDictionary(locale)

  return { locale, dictionary }
}
