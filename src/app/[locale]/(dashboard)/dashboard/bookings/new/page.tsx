"use client"

import type React from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2, Trash2, Plus, Search, UserCheck, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateOrder } from "@/hooks/use-orders"
import { useTours } from "@/hooks/use-tours"
import { useTransports } from "@/hooks/use-transports"
import { useOfferByCode } from "@/hooks/use-offers"
import { fetchUserByEmail, useCreateUser } from "@/hooks/use-users"
import { toast } from "sonner"
import { OrderStatus, PaymentStatus } from "@/types/order"
import type { CreateOrderDto, OrderItem } from "@/types/order"
import type { Tour } from "@/types/tour"
import type { Transport } from "@/types/transport"
import type { User } from "@/types/user"

export default function NewBookingPage() {
  const router = useRouter()
  const createMutation = useCreateOrder()
  const createUserMutation = useCreateUser()
  const { data: toursData } = useTours(1, 100)
  const { data: transportsData } = useTransports(1, 100)

  const [items, setItems] = useState<OrderItem[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [selectedTab, setSelectedTab] = useState<"Tour" | "Transport">("Tour")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  const [existingUser, setExistingUser] = useState<User | null>(null)
  const [isSearchingUser, setIsSearchingUser] = useState(false)
  const [userSearched, setUserSearched] = useState(false)

  const [customerData, setCustomerData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  })

  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    productType: "Tour",
    adults: 1,
    children: 0,
    infants: 0,
  })

  const { data: couponData } = useOfferByCode(couponCode || null)

  const toursList: Tour[] = toursData?.data || []
  const transportsList: Transport[] = transportsData || []

  const handleSearchUser = async () => {
    if (!customerData.customerEmail) {
      toast.error("Por favor ingresa un email para buscar")
      return
    }

    setIsSearchingUser(true)
    setUserSearched(false)

    try {
      const user = await fetchUserByEmail(customerData.customerEmail)
      setExistingUser(user)
      setUserSearched(true)

      if (user) {
        setCustomerData({
          customerName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
          customerEmail: user.email,
          customerPhone: user.phone || "",
        })
        toast.success("Usuario encontrado, datos cargados automáticamente")
      } else {
        toast.info("Usuario no encontrado, puedes crear uno nuevo al guardar la orden")
      }
    } catch (error) {
      console.error("Error searching user:", error)
      toast.error("Error al buscar usuario")
    } finally {
      setIsSearchingUser(false)
    }
  }

  const handleEmailChange = (email: string) => {
    setCustomerData({ ...customerData, customerEmail: email })
    if (userSearched) {
      setExistingUser(null)
      setUserSearched(false)
    }
  }

  const calculateItemTotal = (item: Partial<OrderItem>) => {
    if (!item.unitPrice) return 0
    const passengers = (item.adults || 0) + (item.children || 0) + (item.infants || 0)
    let total = item.unitPrice * passengers
    if (item.appliedOfferId && couponData) {
      const discount = couponData.type === "percentage" ? (total * couponData.value) / 100 : couponData.value
      total -= discount
    }
    return total
  }

  const handleAddItem = () => {
    if (!newItem.productId || !newItem.productType || !newItem.unitPrice) {
      toast.error("Por favor completa todos los campos del item")
      return
    }

    const totalPrice = calculateItemTotal(newItem)

    setItems([
      ...items,
      {
        productId: newItem.productId,
        productType: newItem.productType,
        travelDate: newItem.travelDate,
        adults: newItem.adults,
        children: newItem.children,
        infants: newItem.infants,
        unitPrice: newItem.unitPrice,
        totalPrice,
        appliedOfferId: newItem.appliedOfferId,
        notes: newItem.notes,
      } as OrderItem,
    ])

    setNewItem({
      productType: selectedTab,
      adults: 1,
      children: 0,
      infants: 0,
    })
    setSearchQuery("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
    setShowDeleteDialog(false)
    setItemToDelete(null)
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const discountTotal = items.reduce((sum, item) => {
    if (item.appliedOfferId && couponData) {
      const discount = couponData.type === "percentage" ? (item.unitPrice * couponData.value) / 100 : couponData.value
      return sum + discount
    }
    return sum
  }, 0)
  const grandTotal = subtotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerData.customerName || !customerData.customerEmail) {
      toast.error("Por favor completa los datos del cliente")
      return
    }

    if (items.length === 0) {
      toast.error("Por favor agrega al menos un producto a la orden")
      return
    }

    try {
      let userId = existingUser?._id

      if (!existingUser) {
        try {
          const nameParts = customerData.customerName.trim().split(" ")
          const firstName = nameParts[0] || ""
          const lastName = nameParts.slice(1).join(" ") || ""

          const newUser = await createUserMutation.trigger({
            firstName,
            lastName,
            email: customerData.customerEmail,
            authProvider: "local",
            phone: customerData.customerPhone || undefined,
          })
          userId = newUser._id
          toast.success("Usuario creado correctamente")
        } catch (userError) {
          console.error("Error creating user:", userError)
        }
      }

      const orderData: CreateOrderDto = {
        ...(userId && { userId }),
        customerName: customerData.customerName,
        customerEmail: customerData.customerEmail,
        customerPhone: customerData.customerPhone,
        items,
        subtotal,
        discountTotal,
        grandTotal,
        currency: "USD",
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      }

      await createMutation.trigger(orderData)
      toast.success("Orden creada correctamente")
      router.push("/dashboard/bookings")
    } catch {
      toast.error("Error al crear la orden")
    }
  }

  const getProductName = (productId: string, productType: "Tour" | "Transport") => {
    if (productType === "Tour") {
      return toursList.find((t: Tour) => t._id === productId)?.title
    } else {
      const transport = transportsList.find((t: Transport) => t._id === productId)
      return `${transport?.origin?.name} → ${transport?.destination?.name}`
    }
  }

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/bookings">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Crear Nueva Reserva</h1>
                  <p className="text-sm text-muted-foreground">Completa la información de la orden</p>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={createMutation.isMutating || createUserMutation.isMutating}>
                {createMutation.isMutating || createUserMutation.isMutating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Crear Orden
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={customerData.customerEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSearchUser}
                      disabled={isSearchingUser || !customerData.customerEmail}
                    >
                      {isSearchingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      <span className="ml-2 hidden sm:inline">Buscar</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Busca por email para cargar datos de un cliente existente
                  </p>
                </div>

                {userSearched && (
                  <div className="flex items-center gap-2">
                    {existingUser ? (
                      <Badge variant="default" className="bg-green-600">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Cliente existente
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Cliente nuevo (se creará al guardar)
                      </Badge>
                    )}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      placeholder="Nombre completo"
                      value={customerData.customerName}
                      onChange={(e) => setCustomerData({ ...customerData, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="+51 999 999 999"
                      value={customerData.customerPhone}
                      onChange={(e) => setCustomerData({ ...customerData, customerPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Items */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Productos a la Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Buscar Producto</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar tour o transporte..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "Tour" | "Transport")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Tour">Tours</TabsTrigger>
                    <TabsTrigger value="Transport">Transporte</TabsTrigger>
                  </TabsList>

                  <TabsContent value="Tour" className="space-y-4">
                    <Select
                      value={newItem.productId || ""}
                      onValueChange={(value) => {
                        const tour = toursList.find((t: Tour) => t._id === value)
                        setNewItem({
                          ...newItem,
                          productId: value,
                          productType: "Tour",
                          unitPrice: tour?.currentPrice || 0,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar un tour" />
                      </SelectTrigger>
                      <SelectContent>
                        {toursList
                          .filter(
                            (tour) =>
                              tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              tour.locationName.toLowerCase().includes(searchQuery.toLowerCase()),
                          )
                          .map((tour: Tour) => (
                            <SelectItem key={tour._id} value={tour._id}>
                              {tour.title} - ${tour.currentPrice}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>

                  <TabsContent value="Transport" className="space-y-4">
                    <Select
                      value={newItem.productId || ""}
                      onValueChange={(value) => {
                        const transport = transportsList.find((t: Transport) => t._id === value)
                        setNewItem({
                          ...newItem,
                          productId: value,
                          productType: "Transport",
                          unitPrice: transport?.currentPrice || 0,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar un transporte" />
                      </SelectTrigger>
                      <SelectContent>
                        {transportsList
                          .filter(
                            (transport) =>
                              transport.origin?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transport.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
                          )
                          .map((transport: Transport) => (
                            <SelectItem key={transport._id} value={transport._id}>
                              {transport.origin?.name} → {transport.destination?.name} - ${transport.currentPrice}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="adults">Adultos</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="0"
                      value={newItem.adults || 1}
                      onChange={(e) => setNewItem({ ...newItem, adults: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Niños</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      value={newItem.children || 0}
                      onChange={(e) => setNewItem({ ...newItem, children: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="infants">Infantes</Label>
                    <Input
                      id="infants"
                      type="number"
                      min="0"
                      value={newItem.infants || 0}
                      onChange={(e) => setNewItem({ ...newItem, infants: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha de viaje</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newItem.travelDate || ""}
                      onChange={(e) => setNewItem({ ...newItem, travelDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Notas especiales para este item..."
                    value={newItem.notes || ""}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button type="button" onClick={handleAddItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar a la Orden
                </Button>
              </CardContent>
            </Card>

            {/* Items Summary */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Productos en la Orden</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{getProductName(item.productId, item.productType)}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.adults} adultos, {item.children} niños, {item.infants} infantes
                          </div>
                          {item.travelDate && (
                            <div className="text-sm text-muted-foreground">Fecha: {item.travelDate}</div>
                          )}
                          {item.notes && <div className="text-sm text-muted-foreground mt-1">{item.notes}</div>}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              ${item.unitPrice} x {(item.adults || 0) + (item.children || 0) + (item.infants || 0)}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setItemToDelete(index)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountTotal > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento:</span>
                        <span>-${discountTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle>Código de Descuento (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresa código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  {couponData && (
                    <Badge variant="default" className="ml-2">
                      {couponData.type === "percentage" ? `${couponData.value}%` : `$${couponData.value}`} OFF
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto de la orden. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToDelete !== null && handleRemoveItem(itemToDelete)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
