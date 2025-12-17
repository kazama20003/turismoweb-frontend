import { HeroSection } from "@/components/home/hero-section"
import {FeaturedSection} from "@/components/home/featured-section"
import  {ProductsSection}  from "@/components/home/products-section"
import { CustomCursor } from "@/components/home/custom-cursor"
import type { Locale } from "@/lib/i18n/config"
import { PaymentMethodsSection } from "@/components/home/payment-methods-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params


  return (
    <main className="min-h-screen bg-background">
      <CustomCursor scrollToId="reservar">
         <HeroSection locale={locale} />
      </CustomCursor>
      <div id="reservar">
        <CustomCursor text="+TOURS" navigateTo="/tours">
          <ProductsSection locale={locale} />
        </CustomCursor>
      </div>

      <FeaturedSection locale={locale} />
      <PaymentMethodsSection locale={locale} />
      <TestimonialsSection locale={locale} />
    </main>
  )
}
