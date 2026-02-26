"use client"

import dynamic from "next/dynamic"
import { ProductsSection } from "@/components/home/products-section"
import { CustomCursor } from "@/components/home/custom-cursor"
import { LazySection } from "@/components/home/lazy-section"

const FeaturedSection = dynamic(
  () => import("@/components/home/featured-section").then((mod) => mod.FeaturedSection),
  { ssr: false },
)
const TransportSection = dynamic(
  () => import("@/components/home/transport-section").then((mod) => mod.TransportSection),
  { ssr: false },
)
const PaymentMethodsSection = dynamic(
  () => import("@/components/home/payment-methods-section").then((mod) => mod.PaymentMethodsSection),
  { ssr: false },
)
const TestimonialsSection = dynamic(
  () => import("@/components/home/testimonials-section").then((mod) => mod.TestimonialsSection),
  { ssr: false },
)

export function HomeDeferredSections() {
  return (
    <>
      <div id="reservar">
        <LazySection placeholderHeight="95vh">
          <CustomCursor text="+TOURS" navigateTo="/tours">
            <ProductsSection />
          </CustomCursor>
        </LazySection>
      </div>

      <LazySection placeholderHeight="80vh">
        <TransportSection />
      </LazySection>
      <LazySection placeholderHeight="70vh">
        <PaymentMethodsSection />
      </LazySection>
      <LazySection placeholderHeight="70vh">
         <FeaturedSection />
      </LazySection>
      <LazySection placeholderHeight="65vh">
        <TestimonialsSection />
      </LazySection>
    </>
  )
}

