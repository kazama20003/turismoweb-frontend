"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTransport } from "@/hooks/use-transports"
import { useVehicles } from "@/hooks/use-vehicles"
import { useUploadImage } from "@/hooks/use-uploads"
import type { Coordinates, RouteStep, TransportImage, Lang, WeekDay } from "@/types/transport"
import { SUPPORTED_LANGS } from "@/types/transport"
import { ArrowLeft, Upload, X, Plus, Trash2, Info, MapPin, Route, Clock, ImageIcon, Languages } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const WEEKDAYS: { value: WeekDay; label: string }[] = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
]

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
  const [availableDays, setAvailableDays] = useState<WeekDay[]>([])

  const { data: vehiclesData } = useVehicles(1, 100)
  const createTransportMutation = useCreateTransport()
  const uploadImageMutation = useUploadImage()

  const vehicles = vehiclesData?.data || []

  const toggleAvailableDay = (day: WeekDay) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const addRouteStep = () => {
    const newStep: RouteStep = {
      order: route.length + 1,
      name: "",
      lat: 0,
      lng: 0,
      translations: {},
    }
    setRoute([...route, newStep])
  }

  const updateRouteStep = (index: number, field: keyof RouteStep, value: unknown) => {
    const updatedRoute = [...route]
    updatedRoute[index] = { ...updatedRoute[index], [field]: value }
    setRoute(updatedRoute)
  }

  const updateRouteStepTranslation = (index: number, lang: Lang, value: string) => {
    const updatedRoute = [...route]
    updatedRoute[index] = {
      ...updatedRoute[index],
      translations: { ...updatedRoute[index].translations, [lang]: value },
    }
    setRoute(updatedRoute)
  }

  const removeRouteStep = (index: number) => {
    const updatedRoute = route.filter((_, i) => i !== index)
    // Reorder remaining steps
    updatedRoute.forEach((step, i) => {
      step.order = i + 1
    })
    setRoute(updatedRoute)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      try {
        const result = await uploadImageMutation.trigger(file)
        if (result) {
          setImages((prev) => [...prev, { url: result.url, publicId: result.publicId }])
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const handleRouteStepImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadImageMutation.trigger(file)
      if (result) {
        updateRouteStep(index, "image", { url: result.url, publicId: result.publicId })
      }
    } catch (error) {
      console.error("Error uploading route step image:", error)
    }
  }

  const handleSubmit = async () => {
    try {
      const transportData = {
        title: formData.title,
        description: formData.description || undefined,
        routeDescription: formData.routeDescription || undefined,
        titleTranslations: Object.keys(formData.titleTranslations).length > 0 ? formData.titleTranslations : undefined,
        descriptionTranslations:
          Object.keys(formData.descriptionTranslations).length > 0 ? formData.descriptionTranslations : undefined,
        routeDescriptionTranslations:
          Object.keys(formData.routeDescriptionTranslations).length > 0
            ? formData.routeDescriptionTranslations
            : undefined,
        route: route.length > 0 ? route : undefined,
        origin,
        destination,
        vehicle: formData.vehicle,
        currentPrice: formData.currentPrice,
        oldPrice: formData.oldPrice > 0 ? formData.oldPrice : undefined,
        durationHours: formData.durationHours > 0 ? formData.durationHours : undefined,
        durationMinutes: formData.durationMinutes > 0 ? formData.durationMinutes : undefined,
        departureTime: formData.departureTime || undefined,
        arrivalTime: formData.arrivalTime || undefined,
        availableDays: availableDays.length > 0 ? availableDays : undefined,
        images: images.length > 0 ? images : undefined,
      }

      await createTransportMutation.trigger(transportData)
      router.push("/dashboard/transports")
    } catch (error) {
      console.error("Error creating transport:", error)
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
              <div>
                <h1 className="text-xl font-semibold">Nuevo Paquete de Transporte</h1>
                <p className="text-sm text-muted-foreground">Crea un nuevo servicio de transporte turístico</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/transports">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Link>
                </Button>
                <Button onClick={handleSubmit} disabled={createTransportMutation.isMutating}>
                  {createTransportMutation.isMutating ? "Creando..." : "Crear Paquete"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 h-auto">
              <TabsTrigger
                value="general"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">General</span>
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Ubicación</span>
              </TabsTrigger>
              <TabsTrigger
                value="route"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Route className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Ruta</span>
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Horarios</span>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Imágenes</span>
              </TabsTrigger>
              <TabsTrigger
                value="translations"
                className="flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Traducciones</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>Detalles básicos del paquete de transporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Transfer Aeropuerto - Hotel"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe el servicio de transporte..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPrice">Precio Actual</Label>
                      <Input
                        id="currentPrice"
                        type="number"
                        value={formData.currentPrice}
                        onChange={(e) => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oldPrice">Precio Anterior (opcional)</Label>
                      <Input
                        id="oldPrice"
                        type="number"
                        value={formData.oldPrice}
                        onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehículo</Label>
                    <Select
                      value={formData.vehicle}
                      onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.name} - {vehicle.brand} {vehicle.model} ({vehicle.capacity} pax)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ubicaciones</CardTitle>
                  <CardDescription>Define el origen y destino del servicio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Origen</Label>
                    <Input
                      value={origin.name}
                      onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                      placeholder="Nombre del lugar de origen"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={origin.lat}
                        onChange={(e) => setOrigin({ ...origin, lat: Number(e.target.value) })}
                        placeholder="Latitud"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={origin.lng}
                        onChange={(e) => setOrigin({ ...origin, lng: Number(e.target.value) })}
                        placeholder="Longitud"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Destino</Label>
                    <Input
                      value={destination.name}
                      onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                      placeholder="Nombre del lugar de destino"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={destination.lat}
                        onChange={(e) => setDestination({ ...destination, lat: Number(e.target.value) })}
                        placeholder="Latitud"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={destination.lng}
                        onChange={(e) => setDestination({ ...destination, lng: Number(e.target.value) })}
                        placeholder="Longitud"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="routeDescription">Descripción de la Ruta (Opcional)</Label>
                    <Textarea
                      id="routeDescription"
                      value={formData.routeDescription}
                      onChange={(e) => setFormData({ ...formData, routeDescription: e.target.value })}
                      placeholder="Describe la ruta del transporte..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pasos de la Ruta</CardTitle>
                  <CardDescription>Define los puntos de parada en la ruta del transporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Agrega pasos intermedios en la ruta (opcional)</p>
                    <Button type="button" onClick={addRouteStep} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Paso
                    </Button>
                  </div>

                  {route.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No hay pasos agregados. Haz clic en Agregar Paso para comenzar.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {route.map((step, index) => (
                        <Card key={index} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Paso {step.order}</CardTitle>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeRouteStep(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Label>Nombre del Lugar</Label>
                              <Input
                                value={step.name}
                                onChange={(e) => updateRouteStep(index, "name", e.target.value)}
                                placeholder="Ej: Mirador del Valle"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label>Latitud</Label>
                                <Input
                                  type="number"
                                  step="any"
                                  value={step.lat}
                                  onChange={(e) => updateRouteStep(index, "lat", Number(e.target.value))}
                                  placeholder="0.0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Longitud</Label>
                                <Input
                                  type="number"
                                  step="any"
                                  value={step.lng}
                                  onChange={(e) => updateRouteStep(index, "lng", Number(e.target.value))}
                                  placeholder="0.0"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Imagen del Paso (Opcional)</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleRouteStepImageUpload(index, e)}
                              />
                              {step.image?.url && (
                                <div className="relative mt-2">
                                  <Image
                                    src={step.image.url || "/placeholder.svg"}
                                    alt={`Route step ${index + 1}`}
                                    width={200}
                                    height={150}
                                    className="rounded-lg object-cover w-full h-32"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => updateRouteStep(index, "image", undefined)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Traducciones del Nombre</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                                  <div key={lang} className="space-y-1">
                                    <Label htmlFor={`route-${index}-${lang}`} className="text-xs uppercase">
                                      {lang}
                                    </Label>
                                    <Input
                                      id={`route-${index}-${lang}`}
                                      value={step.translations?.[lang] || ""}
                                      onChange={(e) => updateRouteStepTranslation(index, lang, e.target.value)}
                                      placeholder={`Nombre en ${lang}`}
                                      className="text-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Horarios y Duración</CardTitle>
                  <CardDescription>Configura los horarios del servicio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="durationHours">Duración (Horas)</Label>
                      <Input
                        id="durationHours"
                        type="number"
                        value={formData.durationHours}
                        onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="durationMinutes">Duración (Minutos)</Label>
                      <Input
                        id="durationMinutes"
                        type="number"
                        value={formData.durationMinutes}
                        onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Hora de Salida</Label>
                      <Input
                        id="departureTime"
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Hora de Llegada</Label>
                      <Input
                        id="arrivalTime"
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Días Disponibles</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Selecciona los días en los que el servicio está disponible
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                      {WEEKDAYS.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={availableDays.includes(day.value) ? "default" : "outline"}
                          onClick={() => toggleAvailableDay(day.value)}
                          className="w-full justify-center text-xs sm:text-sm"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                    {availableDays.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Si no seleccionas ningún día, se asumirá que el servicio está disponible todos los días
                      </p>
                    )}
                    {availableDays.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-4">
                        Servicio disponible:{" "}
                        {availableDays.map((d) => WEEKDAYS.find((w) => w.value === d)?.label).join(", ")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes</CardTitle>
                  <CardDescription>Agrega imágenes del servicio de transporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Subir Imágenes</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Transport image ${index + 1}`}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover w-full h-32"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setImages(images.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="translations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Traducciones</CardTitle>
                  <CardDescription>Agrega traducciones para otros idiomas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {SUPPORTED_LANGS.filter((lang) => lang !== "es").map((lang) => (
                    <div key={lang} className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-sm uppercase">{lang}</h3>

                      <div className="space-y-2">
                        <Label htmlFor={`title-${lang}`}>Título</Label>
                        <Input
                          id={`title-${lang}`}
                          value={formData.titleTranslations[lang] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              titleTranslations: { ...formData.titleTranslations, [lang]: e.target.value },
                            })
                          }
                          placeholder={`Título en ${lang}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${lang}`}>Descripción</Label>
                        <Textarea
                          id={`description-${lang}`}
                          value={formData.descriptionTranslations[lang] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descriptionTranslations: { ...formData.descriptionTranslations, [lang]: e.target.value },
                            })
                          }
                          placeholder={`Descripción en ${lang}`}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`routeDescription-${lang}`}>Descripción de la Ruta</Label>
                        <Textarea
                          id={`routeDescription-${lang}`}
                          value={formData.routeDescriptionTranslations[lang] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              routeDescriptionTranslations: {
                                ...formData.routeDescriptionTranslations,
                                [lang]: e.target.value,
                              },
                            })
                          }
                          placeholder={`Descripción de la ruta en ${lang}`}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarInset>
  )
}
