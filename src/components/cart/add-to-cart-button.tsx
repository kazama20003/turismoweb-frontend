"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCart, Calendar, Users, Plus, Minus, MapPin, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useCartDrawer } from "@/contexts/cart-context"
import type { CreateCartItemDto } from "@/types/cart"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface AddToCartButtonProps {
  productId: string
  productType: "tour" | "transport"
  productTitle: string
  productImage?: string
  productDescription?: string
  unitPrice: number
  variant?: "default" | "outline"
  triggerChildren?: React.ReactNode
  className?: string
  availabilityType?: "unlimited" | "fixed_dates" | "date_range"
  availableDates?: string[]
}

export function AddToCartButton({
  productId,
  productType,
  productTitle,
  productImage,
  unitPrice,
  variant = "default",
  triggerChildren,
  className,
  availabilityType,
  availableDates = [],
}: AddToCartButtonProps) {
  const [open, setOpen] = useState(false)
  const [travelDate, setTravelDate] = useState("")
  const [adults, setAdults] = useState(1)
  const [childrenCount, setChildrenCount] = useState(0)
  const [infants, setInfants] = useState(0)
  const [notes, setNotes] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCart()
  const { openDrawer } = useCartDrawer()

  const calculateTotal = () => {
    if (productType === "tour") {
      return unitPrice * (adults + childrenCount)
    }
    return unitPrice
  }

  const capitalizeProductType = (type: "tour" | "transport"): "Tour" | "Transport" => {
    return type === "tour" ? "Tour" : "Transport"
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const item: CreateCartItemDto = {
        productId,
        productType: capitalizeProductType(productType),
        unitPrice,
        totalPrice: calculateTotal(),
      }

      if (travelDate) item.travelDate = travelDate
      if (productType === "tour") {
        item.adults = adults
        item.children = childrenCount
        item.infants = infants
      }
      if (notes) item.notes = notes

      await addItem(item)

      toast.success("Agregado al carrito", {
        description: `${productTitle} ha sido agregado exitosamente.`,
      })

      setOpen(false)
      setTravelDate("")
      setAdults(1)
      setChildrenCount(0)
      setInfants(0)
      setNotes("")

      // Pequeño delay para que se cierre el sheet actual antes de abrir el otro
      setTimeout(() => {
        openDrawer()
      }, 300)
    } catch {
      toast.error("Error", {
        description: "No se pudo agregar al carrito. Intenta de nuevo.",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const minDate = new Date().toISOString().split("T")[0]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerChildren || (
          <Button variant={variant} size="lg" className={`font-semibold gap-2 ${className}`}>
            <ShoppingCart className="w-5 h-5" />
            Reservar
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="border-b px-4 py-4 pr-12">
          <SheetTitle>Nueva Reserva</SheetTitle>
          <SheetDescription>Configura los detalles de tu reserva</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Producto info */}
            <div className="flex gap-3 p-3 rounded-lg bg-muted/50 border">
              {productImage ? (
                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
                  <Image src={productImage || "/placeholder.svg"} alt={productTitle} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 shrink-0 rounded-md bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Badge variant="secondary" className="text-[10px] mb-1">
                  {productType === "tour" ? "Tour" : "Transporte"}
                </Badge>
                <h3 className="font-medium text-sm line-clamp-2">{productTitle}</h3>
                <p className="text-lg font-bold text-primary mt-1">${unitPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travel-date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Fecha de viaje
              </Label>
              {availabilityType === "fixed_dates" && availableDates.length > 0 ? (
                <select
                  id="travel-date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecciona una fecha</option>
                  {availableDates
                    .filter((date) => new Date(date) >= new Date(minDate))
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                    .map((date) => {
                      const dateObj = new Date(date)
                      const formattedDate = dateObj.toLocaleDateString("es", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      return (
                        <option key={date} value={dateObj.toISOString().split("T")[0]}>
                          {formattedDate}
                        </option>
                      )
                    })}
                </select>
              ) : (
                <Input
                  id="travel-date"
                  type="date"
                  min={minDate}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              )}
              {availabilityType === "fixed_dates" && availableDates.length === 0 && (
                <p className="text-xs text-destructive">No hay fechas disponibles actualmente</p>
              )}
            </div>

            {/* Pasajeros con scroll propio */}
            {productType === "tour" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Pasajeros
                </Label>

                <div className="border rounded-lg divide-y max-h-[180px] overflow-y-auto">
                  {/* Adultos */}
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">Adultos</p>
                      <p className="text-xs text-muted-foreground">${unitPrice.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-6 text-center font-semibold">{adults}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setAdults(adults + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">Niños</p>
                      <p className="text-xs text-muted-foreground">${unitPrice.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        disabled={childrenCount <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-6 text-center font-semibold">{childrenCount}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Infantes */}
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">Infantes</p>
                      <p className="text-xs text-muted-foreground">Gratis (0-2 años)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        disabled={infants <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-6 text-center font-semibold">{infants}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => setInfants(infants + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Notas
                <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Punto de recogida, solicitudes especiales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="border-t p-4 mt-auto bg-background">
          {productType === "tour" && (adults > 0 || childrenCount > 0) && (
            <div className="w-full space-y-1 text-sm pb-2">
              {adults > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {adults} adulto{adults > 1 ? "s" : ""}
                  </span>
                  <span>${(adults * unitPrice).toFixed(2)}</span>
                </div>
              )}
              {childrenCount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {childrenCount} niño{childrenCount > 1 ? "s" : ""}
                  </span>
                  <span>${(childrenCount * unitPrice).toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
            </div>
          )}

          <div className="w-full flex items-center justify-between pb-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            size="lg"
            className="w-full h-12 text-base font-semibold"
          >
            {isAdding ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                Agregando...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
