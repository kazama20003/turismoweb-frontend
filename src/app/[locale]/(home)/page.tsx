import { HeroSection } from "@/components/home/hero-section"
import { CustomCursor } from "@/components/home/custom-cursor"
import { HomeDeferredSections } from "@/components/home/home-deferred-sections"

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor scrollToId="reservar">
        <HeroSection />
      </CustomCursor>
      <HomeDeferredSections />
    </main>
  )
}
