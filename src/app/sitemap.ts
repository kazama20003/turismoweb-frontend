import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo/seo-config"
import { locales } from "@/lib/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const routes: MetadataRoute.Sitemap = []

  // Home pages for all locales
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    })
  })

  // Tours pages
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })
  })

  // Transports pages
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}/transports`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })
  })

  // About, Contact pages (adjust as needed)
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    })
  })

  return routes
}
