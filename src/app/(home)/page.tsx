"use client"
import { HeroSection } from "@/components/home/hero-section"
import Header from "@/components/home/header"
import FeaturedSection from "@/components/home/featured-section"
import ProductsSection from "@/components/home/products-section"
import Cursor from "@/components/home/cursor"
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Cursor />
      <Header />
      <HeroSection />
      <ProductsSection />
      <FeaturedSection />
      
    </main>
  )
}
