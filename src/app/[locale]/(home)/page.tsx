import { HeroSection } from "@/components/home/hero-section"
import FeaturedSection from "@/components/home/featured-section"
import ProductsSection from "@/components/home/products-section"
import { CustomCursor } from "@/components/home/custom-cursor"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

export default async function HomePage({
  params,
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(params.locale)

  return (
    <main className="min-h-screen bg-background">
      <CustomCursor scrollToId="reservar">
        <HeroSection
          title={dict.hero.title}
          titleLine2={dict.hero.titleLine2}
          description={dict.hero.description}
          planVisit={dict.hero.planVisit}
          shopNow={dict.hero.shopNow}
        />
      </CustomCursor>

      <div id="reservar">
        <CustomCursor text="+TOURS" navigateTo="/tours">
          <ProductsSection />
        </CustomCursor>
      </div>

      <FeaturedSection />
    </main>
  )
}
