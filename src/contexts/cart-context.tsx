"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartDrawerContextType {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  setIsOpen: (open: boolean) => void
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <CartDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, setIsOpen }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const context = useContext(CartDrawerContext)
  if (!context) {
    throw new Error("useCartDrawer must be used within a CartDrawerProvider")
  }
  return context
}
