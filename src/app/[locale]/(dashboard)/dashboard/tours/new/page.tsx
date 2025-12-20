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
import { ArrowLeft, Save, Upload, Loader2, X } from "lucide-react"
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
    durationDays: 1,
    currentPrice: 0,
    slug: "",
    images: [],
    videoUrl: "", // Added videoUrl field
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
    itinerary: [], // Added itinerary field
    cancellationPolicy: "", // Added policies
    refundPolicy: "",
    changePolicy: "",
    startTime: "", // Added startTime field
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [itineraryInput, setItineraryInput] = useState("")

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

      console.log("[v0] Vehicle IDs updated:", newVehicleIds) // Added debug log

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
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, title: value, slug })
  }

  const parseItinerary = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    return lines.map((line, index) => ({
      order: index + 1,
      title: line.substring(0, 100),
      description: line,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.locationName) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    if (itineraryInput.trim()) {
      formData.itinerary = parseItinerary(itineraryInput)
    }

    const dataToSend = {
      ...formData,
      vehicleIds: formData.hasTransport ? formData.vehicleIds : [],
    }

    console.log("[v0] Submitting tour data:", dataToSend) // Added debug log

    try {
      await createMutation.trigger(dataToSend as CreateTourDto)
      toast.success("Tour creado correctamente")
      router.push("/dashboard/tours")
    } catch (error) {
      console.log("[v0] Error creating tour:", error) // Added debug log
      toast.error("Error al crear el tour")
    }
  }

  // Filter only active vehicles
  const activeVehicles = vehiclesData?.data?.filter((vehicle) => vehicle.isActive) || []

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

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Ubicación *</Label>
                    <Input
                      id="locationName"
                      value={formData.locationName}
                      onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationDays">Días de duración</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Precio (USD) *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: Number.parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={formData.difficulty}
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
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || undefined })
                      }
                    />
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
                      <SelectItem value="always_available">Siempre Disponible (Cualquier día)</SelectItem>
                      <SelectItem value="fixed_dates">Fechas Fijas Específicas</SelectItem>
                      <SelectItem value="date_range">Rango de Fechas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.availabilityType === "fixed_dates" && (
                  <div className="space-y-2">
                    <Label htmlFor="availableDates">
                      Fechas Disponibles (separadas por comas, formato: YYYY-MM-DD)
                    </Label>
                    <Textarea
                      id="availableDates"
                      placeholder="Ej: 2024-12-25, 2024-12-31, 2025-01-15"
                      onChange={(e) => {
                        const dates = e.target.value
                          .split(",")
                          .map((d) => d.trim())
                          .filter(Boolean)
                        setFormData({ ...formData, availableDates: dates })
                      }}
                      rows={3}
                    />
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

            <Card>
              <CardHeader>
                <CardTitle>Itinerario (Se traducirá automáticamente)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itinerary">Describe el itinerario del tour</Label>
                  <Textarea
                    id="itinerary"
                    value={itineraryInput}
                    onChange={(e) => setItineraryInput(e.target.value)}
                    rows={8}
                    placeholder="Escribe cada paso del itinerario en una línea nueva. Ejemplo:&#10;Día 1: Llegada a Lima y city tour&#10;Día 2: Visita a Machu Picchu&#10;Día 3: Retorno a Lima"
                  />
                  <p className="text-sm text-muted-foreground">
                    Cada línea se convertirá en un paso del itinerario. Este contenido se traducirá automáticamente.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beneficios del Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="benefits">Beneficios (separados por comas)</Label>
                  <Textarea
                    id="benefits"
                    placeholder="Ej: Guía profesional, Entrada incluida, Transporte privado, Almuerzo incluido"
                    onChange={(e) => handleArrayInput("benefits", e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">Lista los beneficios del tour separados por comas</p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
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

            {/* Supported Languages */}
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

            {/* Vehicles - Only Active */}
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
                        console.log("[v0] hasTransport changed to:", checked) // Added debug log
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
                    placeholder="Ej: Transporte, Guía turístico, Entradas, Almuerzo"
                    onChange={(e) => handleArrayInput("includes", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excludes">Qué No Incluye (separado por comas)</Label>
                  <Textarea
                    id="excludes"
                    placeholder="Ej: Propinas, Bebidas alcohólicas, Gastos personales"
                    onChange={(e) => handleArrayInput("excludes", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hasGuide"
                      checked={formData.hasGuide}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasGuide: checked as boolean })}
                    />
                    <Label htmlFor="hasGuide">Incluye guía</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                    />
                    <Label htmlFor="isActive">Tour activo</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    placeholder="Describe las condiciones de cancelación del tour"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Política de Reembolso</Label>
                  <Textarea
                    id="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                    rows={3}
                    placeholder="Describe las condiciones de reembolso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changePolicy">Política de Cambios</Label>
                  <Textarea
                    id="changePolicy"
                    value={formData.changePolicy}
                    onChange={(e) => setFormData({ ...formData, changePolicy: e.target.value })}
                    rows={3}
                    placeholder="Describe las condiciones para realizar cambios en la reserva"
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
  