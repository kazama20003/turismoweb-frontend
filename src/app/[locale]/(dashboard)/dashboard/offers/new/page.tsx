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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateOffer } from "@/hooks/use-offers"
import { useTours } from "@/hooks/use-tours"
import { useTransports } from "@/hooks/use-transports"
import { toast } from "sonner"
import type { CreateOfferDto, OfferType, ApplicableItem } from "@/types/offer"
import type { Tour } from "@/types/tour"
import type { Transport } from "@/types/transport"

export default function NewOfferPage() {
  const router = useRouter()
  const createMutation = useCreateOffer()
  const { data: toursData } = useTours(1, 100)
  const { data: transportsData } = useTransports(1, 100)

  const [formData, setFormData] = useState<Partial<CreateOfferDto>>({
    title: "",
    description: "",
    code: "",
    type: "percentage",
    value: 0,
    minTotal: 0,
    maxUses: 1000,
    isActive: true,
    startDate: "",
    endDate: "",
    appliesToAll: false,
    applicableItems: [],
  })

  const [searchTourQuery, setSearchTourQuery] = useState("")
  const [searchTransportQuery, setSearchTransportQuery] = useState("")
  const [activeProductTab, setActiveProductTab] = useState<"tour" | "transport">("tour")

  const handleCodeGenerate = () => {
    const code = `OFFER-${Date.now().toString().slice(-6).toUpperCase()}`
    setFormData({ ...formData, code })
    toast.success(`Código generado: ${code}`)
  }

  const handleProductToggle = (productId: string, productType: "tour" | "transport", checked: boolean) => {
    const newItem: ApplicableItem = { itemId: productId, productType }
    setFormData((prev) => ({
      ...prev,
      applicableItems: checked
        ? [...(prev.applicableItems || []), newItem]
        : (prev.applicableItems || []).filter((item) => item.itemId !== productId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.code || formData.value === undefined || formData.applicableItems?.length === 0) {
      toast.error("Por favor completa los campos obligatorios y selecciona al menos un producto")
      return
    }

    try {
      const payload: CreateOfferDto = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      } as CreateOfferDto

      console.log("[v0] Payload to send:", payload)

      await createMutation.trigger(payload)
      toast.success("Oferta creada correctamente")
      router.push("/dashboard/offers")
    } catch (error) {
      console.log("[v0] Error creating offer:", error)
      toast.error("Error al crear la oferta")
    }
  }

  const tours = toursData?.data || []
  const transports = transportsData || []

  const filteredTours = tours.filter(
    (tour: Tour) =>
      tour.title?.toLowerCase().includes(searchTourQuery.toLowerCase()) ||
      tour.locationName?.toLowerCase().includes(searchTourQuery.toLowerCase()),
  )

  const filteredTransports = transports.filter(
    (transport: Transport) =>
      transport.title?.toLowerCase().includes(searchTransportQuery.toLowerCase()) ||
      (transport.origin?.name ?? "").toLowerCase().includes(searchTransportQuery.toLowerCase()),
  )

  const isProductSelected = (productId: string) => {
    return formData.applicableItems?.some((item) => item.itemId === productId) || false
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
                  <Link href="/dashboard/offers">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Crear Nueva Oferta</h1>
                  <p className="text-sm text-muted-foreground">Configura una oferta y aplícala a productos</p>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={createMutation.isMutating}>
                {createMutation.isMutating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Oferta
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Oferta *</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Descuento de Verano"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código de Cupón *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        placeholder="SUMMER2024"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                      <Button type="button" variant="outline" onClick={handleCodeGenerate}>
                        Generar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe la oferta..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Descuento *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: OfferType) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                        <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">
                      Valor del Descuento {formData.type === "percentage" ? "(%)" : "($)"} *
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      step={formData.type === "percentage" ? "1" : "0.01"}
                      max={formData.type === "percentage" ? "100" : undefined}
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: Number.parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minTotal">Monto Mínimo de Compra ($)</Label>
                    <Input
                      id="minTotal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minTotal || ""}
                      onChange={(e) => setFormData({ ...formData, minTotal: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Expiración</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Usos Totales Permitidos</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      min="1"
                      value={formData.maxUses || ""}
                      onChange={(e) => setFormData({ ...formData, maxUses: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                    />
                    <Label htmlFor="isActive" className="mb-0">
                      Oferta activa
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products to Apply Offer */}
            <Card>
              <CardHeader>
                <CardTitle>Aplicar Oferta a Productos *</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeProductTab}
                  onValueChange={(value) => setActiveProductTab(value as "tour" | "transport")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tour">Tours ({filteredTours.length})</TabsTrigger>
                    <TabsTrigger value="transport">Transporte ({filteredTransports.length})</TabsTrigger>
                  </TabsList>

                  {/* Tours Tab */}
                  <TabsContent value="tour" className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar tours..."
                        className="pl-8"
                        value={searchTourQuery}
                        onChange={(e) => setSearchTourQuery(e.target.value)}
                      />
                    </div>

                    {filteredTours.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No hay tours disponibles</p>
                    ) : (
                      <div className="grid gap-2 max-h-96 overflow-y-auto">
                        {filteredTours.map((tour: Tour) => (
                          <div
                            key={tour._id}
                            className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50"
                          >
                            <Checkbox
                              id={`tour-${tour._id}`}
                              checked={isProductSelected(tour._id)}
                              onCheckedChange={(checked) => handleProductToggle(tour._id, "tour", checked as boolean)}
                            />
                            <Label htmlFor={`tour-${tour._id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium">{tour.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {tour.locationName} • ${tour.currentPrice}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Transport Tab */}
                  <TabsContent value="transport" className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar transporte..."
                        className="pl-8"
                        value={searchTransportQuery}
                        onChange={(e) => setSearchTransportQuery(e.target.value)}
                      />
                    </div>

                    {filteredTransports.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No hay transporte disponible</p>
                    ) : (
                      <div className="grid gap-2 max-h-96 overflow-y-auto">
                        {filteredTransports.map((transport: Transport) => {
                          const vehicleInfo = typeof transport.vehicle === "string" ? null : transport.vehicle

                          return (
                            <div
                              key={transport._id}
                              className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50"
                            >
                              <Checkbox
                                id={`transport-${transport._id}`}
                                checked={isProductSelected(transport._id)}
                                onCheckedChange={(checked) =>
                                  handleProductToggle(transport._id, "transport", checked as boolean)
                                }
                              />
                              <Label htmlFor={`transport-${transport._id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">{transport.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {transport.origin?.name} → {transport.destination?.name} • ${transport.currentPrice}
                                  {vehicleInfo && ` • ${vehicleInfo.capacity} personas`}
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {formData.applicableItems && formData.applicableItems.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      {formData.applicableItems.length} producto(s) seleccionado(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </SidebarInset>
  )
}
