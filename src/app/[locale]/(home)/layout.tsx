"use client"

import type { ReactNode } from "react"
import Header from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { CartDrawerProvider } from "@/contexts/cart-context"
import { LenisProvider } from "@/components/providers/lenis-provider"

interface HomeLayoutProps {
  children: ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <LenisProvider>
      <CartDrawerProvider>
        <Header />
        {children}
        <Footer />
      </CartDrawerProvider>
    </LenisProvider>
  )
}
