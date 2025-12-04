"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, MapPin, Plus, Trash2, X, Info, Route, Languages, ImageIcon, Clock } from "lucide-react"
import Image from "next/image"
import { useCreateTransport } from "@/hooks/use-transports"
import { useVehicles } from "@/hooks/use-vehicles"
import { useUploadImage, useDeleteImage } from "@/hooks/use-uploads"
import type { Coordinates, RouteStep, TransportImage, Lang } from "@/types/transport"

const SUPPORTED_LANGS: Lang[] = ["es", "en", "fr", "it", "de", "pt", "zh", "ja", "ru"]

const LANG_LABELS: Record<Lang, { name: string; flag: string }> = {
  es: { name: "Español", flag: "🇪🇸" },
  en: { name: "Inglés", flag: "🇺🇸" },
  fr: { name: "Francés", flag: "🇫🇷" },
  it: { name: "Italiano", flag: "🇮🇹" },
  de: { name: "Alemán", flag: "🇩🇪" },
  pt: { name: "Portugués", flag: "🇵🇹" },
  zh: { name: "Chino", flag: "🇨🇳" },
  ja: { name: "Japonés", flag: "🇯🇵" },
  ru: { name: "Ruso", flag: "🇷🇺" },
}

export default function NewTransportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    routeDescription: "",
    currentPrice: 0,
    oldPrice: 0,
    vehicle: "",
    isActive: true,
    durationHours: 0,
    durationMinutes: 0,
    departureTime: "",
    arrivalTime: "",
    titleTranslations: {} as Partial<Record<Lang, string>>,
    descriptionTranslations: {} as Partial<Record<Lang, string>>,
    routeDescriptionTranslations: {} as Partial<Record<Lang, string>>,
  })
  const [origin, setOrigin] = useState<Coordinates>({ name: "", lat: 0, lng: 0 })
  const [destination, setDestination] = useState<Coordinates>({ name: "", lat: 0, lng: 0 })
  const [route, setRoute] = useState<RouteStep[]>([])
  const [images, setImages] = useState<TransportImage[]>([])

  const { data: vehiclesData } = useVehicles(1, 100)
  const vehicles = Array.isArray(vehiclesData)
    ? vehiclesData.filter((v) => v.isActive)
    : vehiclesData?.data?.filter((v) => v.isActive) || []

  const createMutation = useCreateTransport()
  const uploadMutation = useUploadImage()
  const deleteMutation = useDeleteImage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["currentPrice", "oldPrice", "durationHours", "durationMinutes"].includes(name) ? Number(value) : value,
    }))
  }

  const handleTranslationChange = (
    field: "titleTranslations" | "descriptionTranslations" | "routeDescriptionTranslations",
    lang: Lang,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }))
  }

  const handleOriginChange = (field: keyof Coordinates, value: string | number) => {
    setOrigin((prev) => ({ ...prev, [field]: field === "name" ? value : Number(value) }))
  }

  const handleDestinationChange = (field: keyof Coordinates, value: string | number) => {
    setDestination((prev) => ({ ...prev, [field]: field === "name" ? value : Number(value) }))
  }

  const addRouteStep = () => {
    setRoute((prev) => [...prev, { order: prev.length + 1, name: "", lat: 0, lng: 0, translations: {} }])
  }

  const updateRouteStep = (index: number, field: keyof RouteStep, value: string | number) => {
    setRoute((prev) =>
      prev.map((step, i) =>
        i === index
          ? { ...step, [field]: ["lat", "lng", "order"].includes(field as string) ? Number(value) : value }
          : step,
      ),
    )
  }

  const updateRouteStepTranslation = (index: number, lang: Lang, value: string) => {
    setRoute((prev) =>
      prev.map((step, i) => (i === index ? { ...step, translations: { ...step.translations, [lang]: value } } : step)),
    )
  }

  const handleRouteStepImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      try {
        const result = await uploadMutation.trigger(file)
        if (result.publicId && result.url) {
          setRoute((prev) =>
            prev.map((step, i) =>
              i === index ? { ...step, image: { url: result.url, publicId: result.publicId } } : step,
            ),
          )
        }
      } catch (error) {
        console.error("Error uploading route step image:", error)
      }
    }
  }

  const handleDeleteRouteStepImage = async (index: number, publicId: string) => {
    try {
      await deleteMutation.trigger(publicId)
      setRoute((prev) => prev.map((step, i) => (i === index ? { ...step, image: undefined } : step)))
    } catch (error) {
      console.error("Error deleting route step image:", error)
    }
  }

  const removeRouteStep = (index: number) => {
    setRoute((prev) => prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i + 1 })))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      for (const file of Array.from(files)) {
        try {
          const result = await uploadMutation.trigger(file)
          if (result.publicId && result.url) {
            setImages((prev) => [...prev, result])
          }
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
    }
  }

  const handleDeleteImage = async (publicId: string) => {
    try {
      await deleteMutation.trigger(publicId)
      setImages((prev) => prev.filter((img) => img.publicId !== publicId))
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !origin.name || !destination.name || !formData.vehicle) {
      alert("Por favor completa los campos requeridos: título, origen, destino y vehículo")
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      routeDescription: formData.routeDescription,
      currentPrice: formData.currentPrice,
      oldPrice: formData.oldPrice || undefined,
      vehicle: formData.vehicle,
      isActive: formData.isActive,
      durationHours: formData.durationHours,
      durationMinutes: formData.durationMinutes,
      departureTime: formData.departureTime || undefined,
      arrivalTime: formData.arrivalTime || undefined,
      origin,
      destination,
      route: route.map((step) => ({
        order: step.order,
        name: step.name,
        lat: step.lat,
        lng: step.lng,
        image: step.image,
        translations: step.translations,
      })),
      images: images.map((img) => ({ url: img.url, publicId: img.publicId })),
      titleTranslations: formData.titleTranslations,
      descriptionTranslations: formData.descriptionTranslations,
      routeDescriptionTranslations: formData.routeDescriptionTranslations,
    }

    try {
      await createMutation.trigger(payload)
      router.push("/dashboard/transports")
    } catch (error) {
      console.error("Error creating transport:", error)
    }
  }

  const isLoading = createMutation.isMutating || uploadMutation.isMutating

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/transports">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Nuevo Paquete de Transporte</h1>
                  <p className="text-sm text-muted-foreground">Crea un nuevo servicio de transporte turístico</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/transports">Cancelar</Link>
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Paquete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general" className="gap-2">
                <Info className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Clock className="h-4 w-4" />
                Horarios
              </TabsTrigger>
              <TabsTrigger value="route" className="gap-2">
                <Route className="h-4 w-4" />
                Ruta
              </TabsTrigger>
              <TabsTrigger value="translations" className="gap-2">
                <Languages className="h-4 w-4" />
                Traducciones
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Imágenes
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Información Principal</CardTitle>
                  <CardDescription>Datos básicos del paquete de transporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Título del Paquete *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Ej: Transporte Cusco - Machu Picchu"
                      />
                      <p className="text-xs text-muted-foreground">
                        Este es el nombre principal que verán los clientes
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe el servicio de transporte, comodidades, incluye información relevante..."
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Precios y Vehículo</CardTitle>
                  <CardDescription>Configura los precios y asigna un vehículo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPrice">Precio Actual (USD) *</Label>
                      <Input
                        id="currentPrice"
                        name="currentPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.currentPrice || ""}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oldPrice">Precio Anterior (USD)</Label>
                      <Input
                        id="oldPrice"
                        name="oldPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.oldPrice || ""}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">Opcional, para mostrar descuentos</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Vehículo Asignado *</Label>
                      <Select
                        value={formData.vehicle}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicle: value }))}
                      >
                        <SelectTrigger id="vehicle">
                          <SelectValue placeholder="Selecciona un vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle._id} value={vehicle._id}>
                              {vehicle.name} - {vehicle.brand} ({vehicle.capacity} pasajeros)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isActive">Estado del Paquete</Label>
                    <Select
                      value={formData.isActive ? "active" : "inactive"}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === "active" }))}
                    >
                      <SelectTrigger id="isActive">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Disponible - Listo para reservas</SelectItem>
                        <SelectItem value="inactive">No disponible - Suspendido temporalmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Duración del Viaje</CardTitle>
                  <CardDescription>Tiempo estimado del recorrido completo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="durationHours">Horas</Label>
                      <Input
                        id="durationHours"
                        name="durationHours"
                        type="number"
                        min="0"
                        value={formData.durationHours || ""}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="durationMinutes">Minutos</Label>
                      <Input
                        id="durationMinutes"
                        name="durationMinutes"
                        type="number"
                        min="0"
                        max="59"
                        value={formData.durationMinutes || ""}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Horarios de Salida y Llegada</CardTitle>
                  <CardDescription>Horarios programados del servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Hora de Salida</Label>
                      <Input
                        id="departureTime"
                        name="departureTime"
                        type="time"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Hora de partida desde el origen</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Hora de Llegada</Label>
                      <Input
                        id="arrivalTime"
                        name="arrivalTime"
                        type="time"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Hora estimada de llegada al destino</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Route Tab */}
            <TabsContent value="route" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white font-bold">
                        A
                      </div>
                      <div>
                        <CardTitle>Punto de Origen</CardTitle>
                        <CardDescription>Lugar de salida del transporte</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nombre del Lugar *</Label>
                      <Input
                        value={origin.name}
                        onChange={(e) => handleOriginChange("name", e.target.value)}
                        placeholder="Ej: Terminal Cusco"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Latitud</Label>
                        <Input
                          type="number"
                          step="any"
                          value={origin.lat || ""}
                          onChange={(e) => handleOriginChange("lat", e.target.value)}
                          placeholder="-13.5320"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitud</Label>
                        <Input
                          type="number"
                          step="any"
                          value={origin.lng || ""}
                          onChange={(e) => handleOriginChange("lng", e.target.value)}
                          placeholder="-71.9675"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                        B
                      </div>
                      <div>
                        <CardTitle>Punto de Destino</CardTitle>
                        <CardDescription>Lugar de llegada del transporte</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nombre del Lugar *</Label>
                      <Input
                        value={destination.name}
                        onChange={(e) => handleDestinationChange("name", e.target.value)}
                        placeholder="Ej: Machu Picchu Pueblo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Latitud</Label>
                        <Input
                          type="number"
                          step="any"
                          value={destination.lat || ""}
                          onChange={(e) => handleDestinationChange("lat", e.target.value)}
                          placeholder="-13.1631"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitud</Label>
                        <Input
                          type="number"
                          step="any"
                          value={destination.lng || ""}
                          onChange={(e) => handleDestinationChange("lng", e.target.value)}
                          placeholder="-72.5450"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Descripción de la Ruta</CardTitle>
                  <CardDescription>Describe el recorrido general del viaje</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="routeDescription"
                    value={formData.routeDescription}
                    onChange={handleInputChange}
                    placeholder="Describe el itinerario, paisajes, puntos de interés durante el viaje..."
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Paradas Intermedias</CardTitle>
                      <CardDescription>Agrega paradas opcionales en el recorrido con sus traducciones</CardDescription>
                    </div>
                    <Button type="button" variant="outline" onClick={addRouteStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Parada
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {route.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No hay paradas intermedias definidas</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Las paradas son opcionales. El recorrido puede ser directo de origen a destino.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {route.map((step, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                {step.order}
                              </div>
                              {index < route.length - 1 && <div className="w-0.5 h-8 bg-border mt-2" />}
                            </div>
                            <div className="flex-1 space-y-4">
                              {/* Basic Info */}
                              <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2 md:col-span-2">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Nombre de la Parada (Español) *
                                  </Label>
                                  <Input
                                    value={step.name}
                                    onChange={(e) => updateRouteStep(index, "name", e.target.value)}
                                    placeholder="Ej: Mirador del Valle"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground">Latitud</Label>
                                  <Input
                                    type="number"
                                    step="any"
                                    value={step.lat || ""}
                                    onChange={(e) => updateRouteStep(index, "lat", e.target.value)}
                                    placeholder="-12.0500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground">Longitud</Label>
                                  <Input
                                    type="number"
                                    step="any"
                                    value={step.lng || ""}
                                    onChange={(e) => updateRouteStep(index, "lng", e.target.value)}
                                    placeholder="-77.0450"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                  <Languages className="h-3 w-3" />
                                  Traducciones del Nombre
                                </Label>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                  {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                                    <div key={lang} className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">
                                        {LANG_LABELS[lang].flag} {LANG_LABELS[lang].name}
                                      </Label>
                                      <Input
                                        value={step.translations?.[lang] || ""}
                                        onChange={(e) => updateRouteStepTranslation(index, lang, e.target.value)}
                                        placeholder={`Nombre en ${LANG_LABELS[lang].name.toLowerCase()}`}
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Image Upload */}
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground">
                                  Imagen de la Parada (opcional)
                                </Label>
                                {step.image?.url ? (
                                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border group">
                                    <Image
                                      src={step.image.url || "/placeholder.svg"}
                                      alt={step.name || "Parada"}
                                      fill
                                      className="object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRouteStepImage(index, step.image!.publicId!)}
                                      disabled={deleteMutation.isMutating}
                                      className="absolute top-1 right-1 bg-destructive/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3 text-white" />
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <input
                                      type="file"
                                      id={`route-step-image-${index}`}
                                      accept="image/jpeg,image/jpg,image/png,image/webp"
                                      onChange={(e) => handleRouteStepImageUpload(index, e)}
                                      disabled={uploadMutation.isMutating}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`route-step-image-${index}`}
                                      className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                      <ImageIcon className="h-4 w-4" />
                                      Subir imagen
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeRouteStep(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Translations Tab */}
            <TabsContent value="translations" className="space-y-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Traducción del Título</CardTitle>
                  <CardDescription>Traduce el título del paquete a diferentes idiomas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                      <div key={lang} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>{LANG_LABELS[lang].flag}</span>
                          {LANG_LABELS[lang].name}
                        </Label>
                        <Input
                          value={formData.titleTranslations[lang] || ""}
                          onChange={(e) => handleTranslationChange("titleTranslations", lang, e.target.value)}
                          placeholder={`Título en ${LANG_LABELS[lang].name.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Traducción de la Descripción</CardTitle>
                  <CardDescription>Traduce la descripción general del paquete</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                      <div key={lang} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>{LANG_LABELS[lang].flag}</span>
                          {LANG_LABELS[lang].name}
                        </Label>
                        <Textarea
                          value={formData.descriptionTranslations[lang] || ""}
                          onChange={(e) => handleTranslationChange("descriptionTranslations", lang, e.target.value)}
                          placeholder={`Descripción en ${LANG_LABELS[lang].name.toLowerCase()}`}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Traducción de la Descripción de la Ruta</CardTitle>
                  <CardDescription>Traduce la descripción del recorrido</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                      <div key={lang} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>{LANG_LABELS[lang].flag}</span>
                          {LANG_LABELS[lang].name}
                        </Label>
                        <Textarea
                          value={formData.routeDescriptionTranslations[lang] || ""}
                          onChange={(e) =>
                            handleTranslationChange("routeDescriptionTranslations", lang, e.target.value)
                          }
                          placeholder={`Descripción de la ruta en ${LANG_LABELS[lang].name.toLowerCase()}`}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Imágenes del Paquete</CardTitle>
                  <CardDescription>
                    Sube fotos del servicio, vehículo o paisajes. La primera imagen será la portada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadMutation.isMutating}
                      className="hidden"
                    />
                    <label htmlFor="images" className="flex flex-col items-center cursor-pointer text-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium">Haz clic para subir imágenes</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, JPEG, PNG o WEBP. Máximo 5MB por imagen.
                      </p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {images.map((image, index) => (
                        <div key={`${image.publicId}-${index}`} className="relative group">
                          <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={`Imagen ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                              Portada
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.publicId)}
                            disabled={deleteMutation.isMutating}
                            className="absolute top-1 right-1 bg-destructive/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarInset>
  )
}
