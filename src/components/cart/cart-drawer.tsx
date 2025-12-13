"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { ShoppingCart, Trash2, Calendar, Users } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/types/cart"

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { cart, isLoading, removeItem, clearCart, itemCount } = useCart()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || "es"

  const formatDate = (date?: string) => {
    if (!date) return "Fecha no especificada"
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTotalPeople = (item: CartItem) => {
    const adults = item.adults || 0
    const children = item.children || 0
    const infants = item.infants || 0
    return adults + children + infants
  }

  const getProductDisplayName = (item: CartItem): string => {
    // If productId is an object with title, use it
    if (typeof item.productId === "object" && item.productId.title) {
      return item.productId.title
    }
    // Fallback to productTitle if exists (legacy)
    if (item.productTitle) return item.productTitle
    // Otherwise create a fallback name based on product type
    return item.productType === "Tour" ? "Tour" : "Transporte"
  }

  const getProductImage = (item: CartItem): string => {
    // If productId is an object with images, use the first one
    if (typeof item.productId === "object" && item.productId.images && item.productId.images.length > 0) {
      return item.productId.images[0].url
    }
    // Fallback to productImage if exists (legacy)
    if (item.productImage) return item.productImage
    return "/placeholder.svg"
  }

  const getProductId = (item: CartItem): string => {
    if (typeof item.productId === "object") {
      return item.productId._id
    }
    return item.productId
  }

  const calculateCartTotal = () => {
    if (!cart?.items?.length) return 0
    if (cart.grandTotal && cart.grandTotal > 0) return cart.grandTotal
    return cart.items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0)
  }

  const calculateSubtotal = () => {
    if (!cart?.items?.length) return 0
    if (cart.subtotal && cart.subtotal > 0) return cart.subtotal
    return cart.items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0)
  }

  const handleProceedToCheckout = () => {
    setOpen(false)
    router.push(`/${locale}/checkout`)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[500px] flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-serif">Carrito de Compras</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : !cart || cart.items?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground">Agrega tours o transportes para comenzar tu aventura</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {cart?.items?.map((item, index) => (
                    <div key={`${getProductId(item)}-${index}`} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                          <Image
                            src={getProductImage(item) || "/placeholder.svg"}
                            alt={getProductDisplayName(item)}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">{getProductDisplayName(item)}</h4>
                              <span className="text-xs text-muted-foreground capitalize">
                                {item.productType === "Tour" ? "Tour" : "Transporte"}
                              </span>
                            </div>
                            <button
                              onClick={() => removeItem(getProductId(item))}
                              className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.travelDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(item.travelDate)}</span>
                            </div>
                          )}

                          {item.productType === "Tour" && getTotalPeople(item) > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>
                                {item.adults && `${item.adults} adultos`}
                                {item.children && `, ${item.children} niños`}
                                {item.infants && `, ${item.infants} infantes`}
                              </span>
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium">${(item.unitPrice ?? 0).toFixed(2)}</span>
                            <span className="text-sm font-semibold">${(item.totalPrice ?? 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {(cart?.discountTotal ?? 0) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Descuento</span>
                      <span className="text-green-600">-${cart?.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${calculateCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                    Proceder al Pago
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={clearCart}>
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
