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
import { Switch } from "@/components/ui/switch"
import { useCreateTransport } from "@/hooks/use-transports"
import { useVehicles } from "@/hooks/use-vehicles"
import { useUploadImage } from "@/hooks/use-uploads"
import type { Coordinates, RouteStep, TransportImage, Lang, WeekDay } from "@/types/transport"
import { SUPPORTED_LANGS } from "@/types/transport"
import { ArrowLeft, Upload, X } from "lucide-react"
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
  const [route] = useState<RouteStep[]>([])
  const [images, setImages] = useState<TransportImage[]>([])
  const [availableDays, setAvailableDays] = useState<WeekDay[]>([])

  const { data: vehiclesData } = useVehicles(1, 100)
  const createTransportMutation = useCreateTransport()
  const uploadImageMutation = useUploadImage()

  const vehicles = vehiclesData?.data || []

  const toggleAvailableDay = (day: WeekDay) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSubmit = async () => {
    try {
      const transportData = {
        ...formData,
        origin,
        destination,
        route: route.length > 0 ? route : undefined,
        images: images.length > 0 ? images : undefined,
        availableDays: availableDays.length > 0 ? availableDays : undefined,
      }

      await createTransportMutation.trigger(transportData)
      router.push("/dashboard/transports")
    } catch (error) {
      console.error("Error creating transport:", error)
    }
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="location">Ubicación</TabsTrigger>
              <TabsTrigger value="schedule">Horarios</TabsTrigger>
              <TabsTrigger value="images">Imágenes</TabsTrigger>
              <TabsTrigger value="translations">Traducciones</TabsTrigger>
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

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive">Estado</Label>
                      <p className="text-sm text-muted-foreground">Activar o desactivar el paquete</p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
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
                    <div className="grid grid-cols-7 gap-2">
                      {WEEKDAYS.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={availableDays.includes(day.value) ? "default" : "outline"}
                          onClick={() => toggleAvailableDay(day.value)}
                          className="w-full justify-center"
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
                    <div className="grid grid-cols-3 gap-4 mt-4">
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
