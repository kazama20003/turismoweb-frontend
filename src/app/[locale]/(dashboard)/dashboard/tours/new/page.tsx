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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Upload, Loader2, X, Info, Plus, Trash2, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateTour, SUPPORTED_LANGUAGES } from "@/hooks/use-tours"
import { useVehicles } from "@/hooks/use-vehicles"
import { useUploadImage } from "@/hooks/use-uploads"
import { toast } from "sonner"
import type { CreateTourDto, Difficulty, AvailabilityType } from "@/types/tour"

export default function NewTourPage() {
  const router = useRouter()
  const createMutation = useCreateTour()
  const { data: vehiclesData } = useVehicles(1, 100)
  const uploadMutation = useUploadImage()

  const [formData, setFormData] = useState<Partial<CreateTourDto>>({
    title: "",
    description: "",
    locationName: "",
    meetingPoint: "",
    durationDays: 1,
    currentPrice: 0,
    oldPrice: undefined,
    slug: "",
    images: [],
    videoUrl: "",
    vehicleIds: [],
    isActive: true,
    isBookable: true, // Changed isBookeable to isBookable
    hasTransport: false,
    hasGuide: false,
    benefits: [],
    preparations: [],
    includes: [],
    excludes: [],
    categories: [],
    languages: [],
    availabilityType: "unlimited",
    availableDates: [],
    itinerary: [],
    cancellationPolicy: "",
    refundPolicy: "",
    changePolicy: "",
    startTime: "",
    coordinates: undefined,
    minAge: undefined,
    metaDescription: "",
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [includesInput, setIncludesInput] = useState("")
  const [excludesInput, setExcludesInput] = useState("")
  const [coordinatesInput, setCoordinatesInput] = useState({ lat: "", lng: "" })

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

  const parseCommaList = (value: string): string[] => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
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

  const handleTitleChange = (value: string) => {
    const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const slug = normalized
      .toLowerCase()
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    setFormData({ ...formData, title: value, slug })
  }

  const initializeItinerary = (days: number) => {
    const newItinerary = Array.from({ length: days }, (_, i) => ({
      order: i + 1,
      title: "",
      description: "",
      durationHours: undefined,
      activities: [],
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false,
      },
      hotelNight: i < days - 1, // All days except the last have hotel nights
    }))
    setFormData((prev) => ({
      ...prev,
      durationDays: days,
      itinerary: newItinerary,
    }))
  }

  const addItineraryDay = () => {
    const newOrder = (formData.itinerary || []).length + 1
    setFormData({
      ...formData,
      itinerary: [
        ...(formData.itinerary || []),
        {
          order: newOrder,
          title: "",
          description: "",
          durationHours: undefined,
          activities: [],
          meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          hotelNight: newOrder < (formData.durationDays || 1),
        },
      ],
    })
  }

  const updateItineraryDay = (
    index: number,
    field: string,
    value: string | number | boolean | string[] | undefined,
  ) => {
    const updated = [...(formData.itinerary || [])]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      if (parent === "meals") {
        updated[index] = {
          ...updated[index],
          meals: {
            breakfast: updated[index].meals?.breakfast || false,
            lunch: updated[index].meals?.lunch || false,
            dinner: updated[index].meals?.dinner || false,
            [child]: value === true,
          },
        }
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setFormData({ ...formData, itinerary: updated })
  }

  const addActivity = (dayIndex: number) => {
    setFormData((prev) => {
      const updated = [...(prev.itinerary || [])]
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities: [...(updated[dayIndex].activities || []), ""],
      }
      return { ...prev, itinerary: updated }
    })
  }

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.itinerary || [])]
      const activities = [...(updated[dayIndex].activities || [])]
      activities[activityIndex] = value
      updated[dayIndex] = { ...updated[dayIndex], activities }
      return { ...prev, itinerary: updated }
    })
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData((prev) => {
      const updated = [...(prev.itinerary || [])]
      const activities = (updated[dayIndex].activities || []).filter((_: string, i: number) => i !== activityIndex)
      updated[dayIndex] = { ...updated[dayIndex], activities }
      return { ...prev, itinerary: updated }
    })
  }

  const removeItineraryDay = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary?.filter((_, i) => i !== dayIndex),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.locationName) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    const isSingleDay = formData.durationDays === 1
    if (!formData.itinerary || formData.itinerary.length === 0) {
      toast.error(`Por favor agrega al menos un ${isSingleDay ? "itinerario" : "día"} al tour`)
      return
    }

    const parsedItinerary = (formData.itinerary || []).map((item) => ({
      order: item.order,
      title: item.title,
      description: item.description,
      durationHours: item.durationHours,
      activities: item.activities,
      meals: item.meals,
      hotelNight: item.hotelNight,
    }))

    const coordinates =
      coordinatesInput.lat && coordinatesInput.lng
        ? {
            lat: Number.parseFloat(coordinatesInput.lat),
            lng: Number.parseFloat(coordinatesInput.lng),
          }
        : undefined

    const dataToSend: CreateTourDto = {
      ...formData,
      itinerary: parsedItinerary,
      coordinates,
      benefits: formData.benefits ? parseCommaList(formData.benefits.join(", ")) : [],
      includes: parseCommaList(includesInput),
      excludes: parseCommaList(excludesInput),
      vehicleIds: formData.hasTransport ? formData.vehicleIds : [],
    } as CreateTourDto

    console.log("[v0] Submitting tour data:", dataToSend)

    try {
      await createMutation.trigger(dataToSend)
      toast.success("Tour creado correctamente")
      router.push("/dashboard/tours")
    } catch (error) {
      console.log("[v0] Error creating tour:", error)
      toast.error("Error al crear el tour")
    }
  }

  const activeVehicles = vehiclesData?.data?.filter((vehicle) => vehicle.isActive) || []
  const isSingleDay = formData.durationDays === 1

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
                  <Link href="/dashboard/tours">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Crear Nuevo Tour</h1>
                  <p className="text-sm text-muted-foreground">Completa la información del tour</p>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={createMutation.isMutating}>
                {createMutation.isMutating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Tour
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      placeholder="Ej: Tour Machu Picchu 2 Días"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Auto-generado)</Label>
                    <Input id="slug" value={formData.slug} disabled className="bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción * (Se traducirá automáticamente)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    placeholder="Describe el tour en español. Esta descripción se traducirá automáticamente a los idiomas seleccionados."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Descripción (SEO)</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription || ""}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    rows={2}
                    placeholder="Descripción breve para motores de búsqueda (máx 160 caracteres)"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.metaDescription || "").length}/160 caracteres
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Ubicación *</Label>
                    <Input
                      id="locationName"
                      value={formData.locationName}
                      onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                      required
                      placeholder="Ej: Cusco, Perú"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Punto de Encuentro</Label>
                    <Input
                      id="meetingPoint"
                      value={formData.meetingPoint || ""}
                      onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                      placeholder="Ej: Hotel Central, lobby principal"
                    />
                    <p className="text-xs text-muted-foreground">Lugar de encuentro con los pasajeros</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationDays">Días de duración *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min="1"
                      value={formData.durationDays}
                      onChange={(e) => {
                        const days = Number.parseInt(e.target.value)
                        if (!isNaN(days)) {
                          initializeItinerary(days)
                        }
                      }}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Precio Actual (USD) *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: Number.parseFloat(e.target.value) })}
                      required
                      placeholder="99.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Precio Original (USD)</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.oldPrice || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          oldPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="149.00 (opcional)"
                    />
                    <p className="text-xs text-muted-foreground">Precio anterior para mostrar descuento</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={formData.difficulty || ""}
                      onValueChange={(value: Difficulty) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minAge">Edad Mínima</Label>
                    <Input
                      id="minAge"
                      type="number"
                      min="0"
                      value={formData.minAge || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minAge: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="Ej: 18"
                    />
                    <p className="text-xs text-muted-foreground">Edad mínima requerida (opcional)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad Máxima</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="Ej: 15"
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <Label className="font-semibold">Coordenadas Geográficas</Label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitud</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={coordinatesInput.lat}
                        onChange={(e) => setCoordinatesInput({ ...coordinatesInput, lat: e.target.value })}
                        placeholder="Ej: -13.1631"
                      />
                      <p className="text-xs text-muted-foreground">Ej: -13.1631 (negativo para sur)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={coordinatesInput.lng}
                        onChange={(e) => setCoordinatesInput({ ...coordinatesInput, lng: e.target.value })}
                        placeholder="Ej: -72.5050"
                      />
                      <p className="text-xs text-muted-foreground">Ej: -72.5050 (negativo para oeste)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Link de Video (Solo Cloudinary)</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    pattern="https://res\.cloudinary\.com/.*"
                    title="Solo se aceptan videos de Cloudinary (https://res.cloudinary.com/...)"
                  />
                  <p className="text-sm text-muted-foreground">Solo se permiten videos alojados en Cloudinary</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de Inicio del Tour</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime || ""}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="09:00"
                  />
                  <p className="text-sm text-muted-foreground">Hora a la que empieza el tour (formato 24 horas)</p>
                </div>
              </CardContent>
            </Card>

            {/* Availability Section */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad del Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="availabilityType">Tipo de Disponibilidad *</Label>
                  <Select
                    value={formData.availabilityType}
                    onValueChange={(value: AvailabilityType) => setFormData({ ...formData, availabilityType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Siempre Disponible (Cualquier día)</SelectItem>
                      <SelectItem value="fixed_dates">Fechas Fijas Específicas</SelectItem>
                      <SelectItem value="date_range">Rango de Fechas</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>Siempre Disponible:</strong> El tour se puede reservar cualquier día del año.
                      <br />
                      <strong>Fechas Fijas:</strong> El tour solo está disponible en fechas específicas que defines.
                      <br />
                      <strong>Rango de Fechas:</strong> El tour está disponible entre una fecha de inicio y fin.
                    </p>
                  </div>
                </div>

                {formData.availabilityType === "fixed_dates" && (
                  <div className="space-y-2">
                    <Label htmlFor="availableDates">
                      Fechas Disponibles (separadas por comas, formato: YYYY-MM-DD)
                    </Label>
                    <Textarea
                      id="availableDates"
                      placeholder="Ejemplo: 2024-12-25, 2024-12-31, 2025-01-15"
                      onChange={(e) => {
                        const dates = parseCommaList(e.target.value)
                        setFormData({ ...formData, availableDates: dates })
                      }}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Escribe cada fecha en formato YYYY-MM-DD, separadas por comas
                    </p>
                  </div>
                )}

                {formData.availabilityType === "date_range" && (
                  <div className="grid gap-4 md:grid-cols-2">
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
                      <Label htmlFor="endDate">Fecha de Fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate || ""}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Itinerary Section - Improved with single/multi-day handling */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isSingleDay ? "Itinerario del Día" : "Itinerario Detallado"} (Se traducirá automáticamente)
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {isSingleDay
                    ? "Completa los detalles de las actividades de este día"
                    : `Agrega información detallada para cada uno de los ${formData.durationDays} días`}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900 mb-4">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    {isSingleDay
                      ? "Define todas las actividades y detalles para este tour de un día."
                      : "Agrega cada día del itinerario con todos sus detalles. Usa los botones para agregar múltiples actividades fácilmente."}
                  </p>
                </div>

                {(formData.itinerary || []).length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No hay {isSingleDay ? "itinerario" : "días"} agregados</p>
                    <Button type="button" onClick={addItineraryDay} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar {isSingleDay ? "Itinerario" : "Primer Día"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(formData.itinerary || []).map((item, dayIndex) => (
                      <Card key={dayIndex} className="border-2">
                        <CardHeader className="pb-3 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                              {isSingleDay ? "Actividades y Detalles" : `Día ${item.order}`}
                            </CardTitle>
                            {!isSingleDay && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItineraryDay(dayIndex)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar Día
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`day-${dayIndex}-title`} className="font-medium">
                                {isSingleDay ? "Nombre/Título" : "Título del Día"}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id={`day-${dayIndex}-title`}
                                value={item.title}
                                onChange={(e) => updateItineraryDay(dayIndex, "title", e.target.value)}
                                placeholder={
                                  isSingleDay ? "Ej: Actividades principales del día" : "Ej: Llegada a Lima y City Tour"
                                }
                                required
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`day-${dayIndex}-duration`} className="font-medium">
                                Duración Aproximada (horas)
                              </Label>
                              <Input
                                id={`day-${dayIndex}-duration`}
                                type="number"
                                min="0"
                                step="0.5"
                                value={item.durationHours || ""}
                                onChange={(e) =>
                                  updateItineraryDay(
                                    dayIndex,
                                    "durationHours",
                                    e.target.value ? Number.parseFloat(e.target.value) : undefined,
                                  )
                                }
                                placeholder="Ej: 8"
                                className="h-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`day-${dayIndex}-description`} className="font-medium">
                              Descripción {isSingleDay ? "del Tour" : "del Día"}{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                              id={`day-${dayIndex}-description`}
                              value={item.description}
                              onChange={(e) => updateItineraryDay(dayIndex, "description", e.target.value)}
                              rows={3}
                              placeholder={
                                isSingleDay
                                  ? "Describe todas las actividades y experiencias..."
                                  : "Describe en detalle las actividades y experiencias de este día..."
                              }
                              required
                              className="resize-none"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Actividades {isSingleDay ? "" : "del Día"}</Label>
                              <Button type="button" variant="outline" size="sm" onClick={() => addActivity(dayIndex)}>
                                <Plus className="h-3 w-3 mr-1" />
                                Agregar Actividad
                              </Button>
                            </div>

                            {(item.activities || []).length === 0 ? (
                              <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
                                <p className="text-sm text-muted-foreground mb-2">No hay actividades agregadas</p>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addActivity(dayIndex)}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Agregar Primera Actividad
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {(item.activities || []).map((activity, activityIndex) => (
                                  <div key={activityIndex} className="flex gap-2 items-center">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                      {activityIndex + 1}
                                    </div>
                                    <Input
                                      value={activity}
                                      onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                      placeholder={`Actividad ${activityIndex + 1}`}
                                      className="h-9"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeActivity(dayIndex, activityIndex)}
                                      className="shrink-0"
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                            <Label className="font-medium">Comidas Incluidas</Label>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`day-${dayIndex}-breakfast`}
                                  checked={item.meals?.breakfast || false}
                                  onCheckedChange={(checked) =>
                                    updateItineraryDay(dayIndex, "meals.breakfast", checked)
                                  }
                                />
                                <Label htmlFor={`day-${dayIndex}-breakfast`} className="cursor-pointer font-normal">
                                  🌅 Desayuno
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`day-${dayIndex}-lunch`}
                                  checked={item.meals?.lunch || false}
                                  onCheckedChange={(checked) => updateItineraryDay(dayIndex, "meals.lunch", checked)}
                                />
                                <Label htmlFor={`day-${dayIndex}-lunch`} className="cursor-pointer font-normal">
                                  ☀️ Almuerzo
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`day-${dayIndex}-dinner`}
                                  checked={item.meals?.dinner || false}
                                  onCheckedChange={(checked) => updateItineraryDay(dayIndex, "meals.dinner", checked)}
                                />
                                <Label htmlFor={`day-${dayIndex}-dinner`} className="cursor-pointer font-normal">
                                  🌙 Cena
                                </Label>
                              </div>
                            </div>
                          </div>

                          {!isSingleDay && (
                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                              <Checkbox
                                id={`day-${dayIndex}-hotel`}
                                checked={item.hotelNight}
                                onCheckedChange={(checked) =>
                                  updateItineraryDay(dayIndex, "hotelNight", checked as boolean)
                                }
                              />
                              <Label htmlFor={`day-${dayIndex}-hotel`} className="cursor-pointer font-normal">
                                🏨 Este día incluye noche de hotel
                              </Label>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {!isSingleDay && (
                      <Button
                        type="button"
                        onClick={addItineraryDay}
                        variant="outline"
                        className="w-full h-12 bg-transparent"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Otro Día
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes del Tour</CardTitle>
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
                  <div className="grid gap-4 md:grid-cols-4">
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
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Idiomas Soportados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona los idiomas en los que el tour estará disponible. La traducción se hará automáticamente.
                </p>
                <div className="grid gap-2 md:grid-cols-3">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <div key={lang.code} className="flex items-center gap-2 p-3 border rounded-md">
                      <Checkbox
                        id={`lang-${lang.code}`}
                        checked={formData.languages?.includes(lang.code)}
                        onCheckedChange={(checked) => handleLanguageToggle(lang.code, checked as boolean)}
                      />
                      <Label htmlFor={`lang-${lang.code}`} className="flex-1 cursor-pointer">
                        {lang.name} ({lang.code.toUpperCase()})
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicles */}
            {activeVehicles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vehículos Disponibles</CardTitle>
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
                    <Label htmlFor="hasTransport">Este tour incluye transporte</Label>
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
                          <Label htmlFor={`vehicle-${vehicle._id}`} className="flex-1 cursor-pointer">
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
                <CardTitle>Información Adicional (Se traducirá automáticamente)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="includes">Qué Incluye (separado por comas)</Label>
                  <Textarea
                    id="includes"
                    value={includesInput}
                    onChange={(e) => setIncludesInput(e.target.value)}
                    placeholder="Transporte privado, Guía turístico certificado, Entradas a todos los sitios, Almuerzo típico, Seguro de viaje"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">Cada item separado por coma (,)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excludes">Qué No Incluye (separado por comas)</Label>
                  <Textarea
                    id="excludes"
                    value={excludesInput}
                    onChange={(e) => setExcludesInput(e.target.value)}
                    placeholder="Propinas, Bebidas alcohólicas, Gastos personales, Cena"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">Cada item separado por coma (,)</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hasGuide"
                      checked={formData.hasGuide}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasGuide: checked as boolean })}
                    />
                    <Label htmlFor="hasGuide">Incluye guía turístico</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isBookable"
                      checked={formData.isBookable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isBookable: checked as boolean })}
                    />
                    <Label htmlFor="isBookable">Tour es reservable</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                    />
                    <Label htmlFor="isActive">Tour activo (visible en el sitio web)</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Políticas (Se traducirán automáticamente)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Política de Cancelación</Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    rows={3}
                    placeholder="Ej: Cancelación gratuita hasta 48 horas antes del tour. Después de ese tiempo se cobrará el 50% del total."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Política de Reembolso</Label>
                  <Textarea
                    id="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                    rows={3}
                    placeholder="Ej: Reembolso completo si se cancela con más de 7 días de anticipación."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changePolicy">Política de Cambios</Label>
                  <Textarea
                    id="changePolicy"
                    value={formData.changePolicy}
                    onChange={(e) => setFormData({ ...formData, changePolicy: e.target.value })}
                    rows={3}
                    placeholder="Ej: Los cambios de fecha están permitidos sin costo hasta 24 horas antes del tour."
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
