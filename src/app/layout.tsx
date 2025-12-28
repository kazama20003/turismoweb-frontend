import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { siteConfig } from "@/lib/seo/seo-config"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "eTourism - Tourism & Transport Dashboard",
  description: "Book tours and transportation services worldwide. Authentic travel experiences at affordable prices.",
  keywords: ["tourism", "tours", "transportation", "travel booking", "vacation"],
  metadataBase: new URL(siteConfig.url),
  authors: [{ name: "eTourism" }],
  creator: "eTourism",
  publisher: "eTourism",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    title: "eTourism - Tourism & Transport Dashboard",
    description: "Book tours and transportation services worldwide.",
    siteName: "eTourism",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "eTourism",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eTourism - Tourism & Transport Dashboard",
    description: "Book tours and transportation services worldwide.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION",
    yandex: "YOUR_YANDEX_VERIFICATION",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <head>
        <meta name="theme-color" content="#1f2937" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "eTourism",
              description: "Global tourism and transportation booking platform",
              url: siteConfig.url,
              logo: `${siteConfig.url}/logo.png`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "support@etourism.com",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "Global",
              },
              areaServed: ["ES", "EN", "FR", "IT", "DE", "PT", "ZH", "JA", "RU"],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
