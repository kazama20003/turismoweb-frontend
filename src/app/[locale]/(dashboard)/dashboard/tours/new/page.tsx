"use client"

import type React from "react"
import Image from "next/image"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Upload, Loader2, X, Plus, ChevronUp, ChevronDown, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateTour, SUPPORTED_LANGUAGES } from "@/hooks/use-tours"
import { useVehicles } from "@/hooks/use-vehicles"
import { useUploadImage } from "@/hooks/use-uploads"
import { toast } from "sonner"
import type { CreateTourDto, TourItineraryItem } from "@/types/tour"

export default function NewTourPage() {
  const router = useRouter()
  const createMutation = useCreateTour()
  const { data: vehiclesData } = useVehicles(1, 100)
  const uploadMutation = useUploadImage()

  const [formData, setFormData] = useState<Partial<CreateTourDto>>({
    title: "",
    description: "",
    locationName: "",
    durationDays: 1,
    currentPrice: 0,
    slug: "",
    images: [],
    videoUrl: "",
    vehicleIds: [],
    isActive: true,
    hasTransport: false,
    hasGuide: false,
    benefits: [],
    preparations: [],
    includes: [],
    excludes: [],
    categories: [],
    languages: [],
    availabilityType: "always_available",
    availableDates: [],
    itinerary: [],
    cancellationPolicy: "",
    refundPolicy: "",
    changePolicy: "",
    startTime: "",
  })

  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await uploadMutation.trigger(file)
      if (result) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), { url: result.url, publicId: result.publicId }],
        }))
        toast.success("Imagen subida correctamente")
      }
    } catch (error) {
      console.log("[v0] Error uploading image:", error)
      toast.error("Error al subir la imagen")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }))
  }

  const handleArrayInput = (field: keyof CreateTourDto, value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, [field]: items }))
  }

  const handleVehicleToggle = (vehicleId: string, checked: boolean) => {
    setFormData((prev) => {
      const newVehicleIds = checked
        ? [...(prev.vehicleIds || []), vehicleId]
        : (prev.vehicleIds || []).filter((id) => id !== vehicleId)

      console.log("[v0] Vehicle IDs updated:", newVehicleIds)

      return {
        ...prev,
        vehicleIds: newVehicleIds,
      }
    })
  }

  const handleLanguageToggle = (langCode: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      languages: checked ? [...(prev.languages || []), langCode] : (prev.languages || []).filter((l) => l !== langCode),
    }))
  }

  

  const addItineraryItem = () => {
    const newItem: TourItineraryItem = {
      order: (formData.itinerary?.length || 0) + 1,
      title: "",
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newItem],
    }))
  }

  const updateItineraryItem = (index: number, field: keyof TourItineraryItem, value: string | number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[index] = { ...newItinerary[index], [field]: value }
      return { ...prev, itinerary: newItinerary }
    })
  }

  const removeItineraryItem = (index: number) => {
    setFormData((prev) => {
      const newItinerary = (prev.itinerary || []).filter((_, i) => i !== index)
      // Reordenar los números de orden
      return {
        ...prev,
        itinerary: newItinerary.map((item, i) => ({ ...item, order: i + 1 })),
      }
    })
  }

  const moveItineraryItem = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      const targetIndex = direction === "up" ? index - 1 : index + 1

      if (targetIndex < 0 || targetIndex >= newItinerary.length)
        return prev

        // Intercambiar posiciones
      ;[newItinerary[index], newItinerary[targetIndex]] = [newItinerary[targetIndex], newItinerary[index]]

      // Actualizar números de orden
      return {
        ...prev,
        itinerary: newItinerary.map((item, i) => ({ ...item, order: i + 1 })),
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.locationName) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    const dataToSend = {
      ...formData,
      vehicleIds: formData.hasTransport ? formData.vehicleIds : [],
    }

    console.log("[v0] Submitting tour data:", dataToSend)

    try {
      await createMutation.trigger(dataToSend as CreateTourDto)
      toast.success("Tour creado correctamente")
      router.push("/dashboard/tours")
    } catch (error) {
      console.log("[v0] Error creating tour:", error)
      toast.error("Error al crear el tour")
    }
  }

  const activeVehicles = vehiclesData?.data?.filter((vehicle) => vehicle.isActive) || []

  return (
    <SidebarInset>
      <div className="m-2 md:m-4 rounded-lg overflow-hidden">
        <header className="flex h-auto md:h-16 shrink-0 items-start md:items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-t-lg p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href="/dashboard/tours">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex-1 md:flex-none">
                <h1 className="text-lg md:text-xl font-semibold">Crear Nuevo Tour</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Completa la información del tour</p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={createMutation.isMutating} className="w-full md:w-auto md:ml-auto">
              {createMutation.isMutating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Tour
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 md:gap-6 p-3 md:p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Disponibilidad del Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Itinerario del Tour</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Define día a día o paso a paso las actividades del tour. Este contenido se traducirá automáticamente.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary && formData.itinerary.length > 0 ? (
                  <div className="space-y-3">
                    {formData.itinerary.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 md:p-4 space-y-3 bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex items-center gap-1 shrink-0">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                              {item.order}
                            </span>
                          </div>

                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="space-y-1.5">
                              <Label htmlFor={`itinerary-title-${index}`} className="text-xs md:text-sm">
                                Título del día/paso
                              </Label>
                              <Input
                                id={`itinerary-title-${index}`}
                                value={item.title}
                                onChange={(e) => updateItineraryItem(index, "title", e.target.value)}
                                placeholder={`Ej: Día ${item.order}: Llegada y City Tour`}
                                className="text-sm md:text-base"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor={`itinerary-desc-${index}`} className="text-xs md:text-sm">
                                Descripción detallada
                              </Label>
                              <Textarea
                                id={`itinerary-desc-${index}`}
                                value={item.description}
                                onChange={(e) => updateItineraryItem(index, "description", e.target.value)}
                                placeholder="Describe las actividades y detalles de este día..."
                                rows={3}
                                className="text-sm md:text-base resize-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveItineraryItem(index, "up")}
                              disabled={index === 0}
                              className="h-8 w-8"
                              title="Mover arriba"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveItineraryItem(index, "down")}
                              disabled={index === (formData.itinerary?.length || 0) - 1}
                              className="h-8 w-8"
                              title="Mover abajo"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItineraryItem(index)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      No hay ítems en el itinerario. Agrega el primer día o paso del tour.
                    </p>
                  </div>
                )}

                <Button type="button" variant="outline" onClick={addItineraryItem} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar {formData.itinerary?.length ? "Siguiente" : "Primer"} Día/Paso
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Beneficios del Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4"></CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Imágenes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted">
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                    </div>
                  </Label>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {formData.images.map((img, index) => (
                      <div key={`${img.publicId}-${index}`} className="relative group">
                        <Image
                          src={img.url || "/placeholder.svg"}
                          alt={`Tour image ${index + 1}`}
                          width={128}
                          height={128}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supported Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Idiomas Soportados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona los idiomas en los que el tour estará disponible. La traducción se hará automáticamente.
                </p>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <div key={lang.code} className="flex items-center gap-2 p-3 border rounded-md">
                      <Checkbox
                        id={`lang-${lang.code}`}
                        checked={formData.languages?.includes(lang.code)}
                        onCheckedChange={(checked) => handleLanguageToggle(lang.code, checked as boolean)}
                      />
                      <Label htmlFor={`lang-${lang.code}`} className="flex-1 cursor-pointer text-sm">
                        {lang.name} ({lang.code.toUpperCase()})
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicles - Only Active */}
            {activeVehicles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Vehículos Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      id="hasTransport"
                      checked={formData.hasTransport}
                      onCheckedChange={(checked) => {
                        console.log("[v0] hasTransport changed to:", checked)
                        setFormData({ ...formData, hasTransport: checked as boolean })
                      }}
                    />
                    <Label htmlFor="hasTransport" className="text-sm">
                      Este tour incluye transporte
                    </Label>
                  </div>
                  {formData.hasTransport && (
                    <div className="grid gap-2">
                      {activeVehicles.map((vehicle) => (
                        <div key={vehicle._id} className="flex items-center gap-2 p-3 border rounded-md">
                          <Checkbox
                            id={`vehicle-${vehicle._id}`}
                            checked={formData.vehicleIds?.includes(vehicle._id)}
                            onCheckedChange={(checked) => handleVehicleToggle(vehicle._id, checked as boolean)}
                          />
                          <Label htmlFor={`vehicle-${vehicle._id}`} className="flex-1 cursor-pointer text-sm">
                            {vehicle.brand} {vehicle.model} ({vehicle.capacity} personas)
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">
                  Información Adicional (Se traducirá automáticamente)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="includes" className="text-sm">
                    Qué Incluye (separado por comas)
                  </Label>
                  <Textarea
                    id="includes"
                    placeholder="Ej: Transporte, Guía turístico, Entradas, Almuerzo"
                    onChange={(e) => handleArrayInput("includes", e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excludes" className="text-sm">
                    Qué No Incluye (separado por comas)
                  </Label>
                  <Textarea
                    id="excludes"
                    placeholder="Ej: Propinas, Bebidas alcohólicas, Gastos personales"
                    onChange={(e) => handleArrayInput("excludes", e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hasGuide"
                      checked={formData.hasGuide}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasGuide: checked as boolean })}
                    />
                    <Label htmlFor="hasGuide" className="text-sm">
                      Incluye guía
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      Tour activo
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Políticas (Se traducirán automáticamente)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy" className="text-sm">
                    Política de Cancelación
                  </Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    rows={3}
                    placeholder="Describe las condiciones de cancelación del tour"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refundPolicy" className="text-sm">
                    Política de Reembolso
                  </Label>
                  <Textarea
                    id="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                    rows={3}
                    placeholder="Describe las condiciones de reembolso"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changePolicy" className="text-sm">
                    Política de Cambios
                  </Label>
                  <Textarea
                    id="changePolicy"
                    value={formData.changePolicy}
                    onChange={(e) => setFormData({ ...formData, changePolicy: e.target.value })}
                    rows={3}
                    placeholder="Describe las condiciones para realizar cambios en la reserva"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </SidebarInset>
  )
}
