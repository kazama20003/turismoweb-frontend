import { HeroSection } from "@/components/home/hero-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { ProductsSection } from "@/components/home/products-section"
import { CustomCursor } from "@/components/home/custom-cursor"
import { PaymentMethodsSection } from "@/components/home/payment-methods-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor scrollToId="reservar">
        <HeroSection />
      </CustomCursor>

      <div id="reservar">
        <CustomCursor text="+TOURS" navigateTo="/tours">
          <ProductsSection />
        </CustomCursor>
      </div>

      <FeaturedSection />
      <PaymentMethodsSection />
      <TestimonialsSection />
    </main>
  )
}
