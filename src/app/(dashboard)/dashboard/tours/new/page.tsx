"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreateTour } from "@/hooks/use-tours"
import type { CreateTourDto } from "@/types/tour"
import Link from "next/link"

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"]
const AVAILABILITY_OPTIONS = ["unlimited", "fixed_dates", "date_range"]
const LANGUAGE_OPTIONS = ["es", "en", "fr", "de", "pt"]
const CATEGORY_OPTIONS = ["adventure", "cultural", "relaxation", "gastronomy", "nature", "urban"]

export default function NewTourPage() {
  const router = useRouter()
  const createTourMutation = useCreateTour()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateTourDto>({
    defaultValues: {
      title: "",
      description: "",
      locationName: "",
      durationDays: 1,
      durationHours: 0,
      difficulty: "medium",
      capacity: 20,
      currentPrice: 0,
      slug: "",
      isActive: true,
      hasTransport: false,
      hasGuide: false,
      limitCapacity: true,
      instantConfirmation: false,
      isBookable: true,
      availabilityType: "unlimited",
    },
  })

  const {
    fields: discountFields,
    append: appendDiscount,
    remove: removeDiscount,
  } = useFieldArray({
    control: form.control,
    name: "discounts",
  })

  const onSubmit = async (data: CreateTourDto) => {
    setIsSubmitting(true)
    createTourMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Tour creado exitosamente")
        router.push("/dashboard/tours")
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error al crear el tour")
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-4 w-full">
              <Link href="/dashboard/tours">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Crear Nuevo Tour</h1>
                <p className="text-sm text-muted-foreground">Completa todos los campos para crear un tour</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg max-w-6xl mx-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Sección Básica */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Información Básica</CardTitle>
                <CardDescription>Datos principales del tour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Tour *</Label>
                    <Input
                      id="title"
                      placeholder="Tour Histórico Centro"
                      {...form.register("title", { required: "Título es requerido" })}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="tour-historico-centro"
                      {...form.register("slug", { required: "Slug es requerido" })}
                    />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe en detalle el tour..."
                    className="min-h-24"
                    {...form.register("description", { required: "Descripción es requerida" })}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Descripción (SEO)</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Breve descripción para SEO..."
                    className="min-h-16"
                    {...form.register("metaDescription")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sección Ubicación */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Ubicación</CardTitle>
                <CardDescription>Detalles de la ubicación del tour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Nombre de Ubicación *</Label>
                    <Input
                      id="locationName"
                      placeholder="Ciudad Colonial"
                      {...form.register("locationName", { required: "Ubicación es requerida" })}
                    />
                    {form.formState.errors.locationName && (
                      <p className="text-sm text-red-500">{form.formState.errors.locationName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Punto de Encuentro</Label>
                    <Input
                      id="meetingPoint"
                      placeholder="Parque Central, entrada principal"
                      {...form.register("meetingPoint")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      placeholder="18.4861"
                      step="0.0001"
                      {...form.register("coordinates.lat", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      placeholder="-69.9312"
                      step="0.0001"
                      {...form.register("coordinates.lng", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Duración y Dificultad */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Duración y Dificultad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="durationDays">Días *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min="1"
                      {...form.register("durationDays", {
                        valueAsNumber: true,
                        required: "Días es requerido",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationHours">Horas</Label>
                    <Input
                      id="durationHours"
                      type="number"
                      min="0"
                      max="24"
                      {...form.register("durationHours", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Controller
                      name="difficulty"
                      control={form.control}
                      render={({ field }) => (
                        <Select value={field.value || "medium"} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAge">Edad Mínima</Label>
                    <Input id="minAge" type="number" min="0" {...form.register("minAge", { valueAsNumber: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Horarios */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Horarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input id="startTime" type="time" {...form.register("startTime")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de Finalización</Label>
                    <Input id="endTime" type="time" {...form.register("endTime")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Precios */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Precio Actual *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="45.00"
                      {...form.register("currentPrice", {
                        valueAsNumber: true,
                        required: "Precio es requerido",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Precio Anterior (Descuento)</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register("oldPrice", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Descuentos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Descuentos por Cantidad</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendDiscount({ people: 10, discount: 5 })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Descuento
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {discountFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs">Personas</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="10"
                            {...form.register(`discounts.${index}.people` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs">Descuento (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="5"
                            {...form.register(`discounts.${index}.discount` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDiscount(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Capacidad */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Capacidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad Máxima</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      {...form.register("capacity", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minPeoplePerBooking">Personas Mínimas por Reserva</Label>
                    <Input
                      id="minPeoplePerBooking"
                      type="number"
                      min="1"
                      {...form.register("minPeoplePerBooking", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPeoplePerBooking">Personas Máximas por Reserva</Label>
                    <Input
                      id="maxPeoplePerBooking"
                      type="number"
                      min="1"
                      {...form.register("maxPeoplePerBooking", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cutoffHours">Corte (horas antes de inicio)</Label>
                    <Input
                      id="cutoffHours"
                      type="number"
                      min="0"
                      {...form.register("cutoffHoursBeforeStart", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Servicios */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div>
                    <Label className="font-medium">Incluye Transporte</Label>
                    <p className="text-sm text-muted-foreground">¿Este tour incluye transporte?</p>
                  </div>
                  <Controller
                    name="hasTransport"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value || false} onCheckedChange={field.onChange} />}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div>
                    <Label className="font-medium">Incluye Guía</Label>
                    <p className="text-sm text-muted-foreground">¿Este tour incluye guía profesional?</p>
                  </div>
                  <Controller
                    name="hasGuide"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value || false} onCheckedChange={field.onChange} />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sección Incluye/Excluye */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Lo que Incluye / Excluye</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="includes">Lo que Incluye (separado por comas)</Label>
                  <Textarea
                    id="includes"
                    placeholder="Desayuno, Hotel, Transporte..."
                    className="min-h-20"
                    {...form.register("includes")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excludes">Lo que Excluye (separado por comas)</Label>
                  <Textarea
                    id="excludes"
                    placeholder="Bebidas, Comidas adicionales..."
                    className="min-h-20"
                    {...form.register("excludes")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sección Disponibilidad */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="availabilityType">Tipo de Disponibilidad</Label>
                  <Controller
                    name="availabilityType"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value || "unlimited"} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option === "unlimited" && "Disponible siempre"}
                              {option === "fixed_dates" && "Fechas fijas"}
                              {option === "date_range" && "Rango de fechas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {form.watch("availabilityType") !== "unlimited" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <Input id="startDate" type="date" {...form.register("startDate")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de Finalización</Label>
                      <Input id="endDate" type="date" {...form.register("endDate")} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sección Categorías y Idiomas */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Categorías e Idiomas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Categorías</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((category) => (
                      <Controller
                        key={category}
                        name="categories"
                        control={form.control}
                        render={({ field }) => (
                          <Badge
                            variant="outline"
                            className={`cursor-pointer ${
                              field.value?.includes(category) ? "bg-primary text-primary-foreground border-primary" : ""
                            }`}
                            onClick={() => {
                              const current = field.value || []
                              if (current.includes(category)) {
                                field.onChange(current.filter((c: string) => c !== category))
                              } else {
                                field.onChange([...current, category])
                              }
                            }}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Badge>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Idiomas</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <Controller
                        key={lang}
                        name="languages"
                        control={form.control}
                        render={({ field }) => (
                          <Badge
                            variant="outline"
                            className={`cursor-pointer ${
                              field.value?.includes(lang) ? "bg-primary text-primary-foreground border-primary" : ""
                            }`}
                            onClick={() => {
                              const current = field.value || []
                              if (current.includes(lang)) {
                                field.onChange(current.filter((l: string) => l !== lang))
                              } else {
                                field.onChange([...current, lang])
                              }
                            }}
                          >
                            {lang.toUpperCase()}
                          </Badge>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección Políticas */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Políticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Política de Cancelación</Label>
                  <Textarea
                    id="cancellationPolicy"
                    placeholder="Describe la política de cancelación..."
                    className="min-h-16"
                    {...form.register("cancellationPolicy")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Política de Reembolso</Label>
                  <Textarea
                    id="refundPolicy"
                    placeholder="Describe la política de reembolso..."
                    className="min-h-16"
                    {...form.register("refundPolicy")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changePolicy">Política de Cambios</Label>
                  <Textarea
                    id="changePolicy"
                    placeholder="Describe la política de cambios..."
                    className="min-h-16"
                    {...form.register("changePolicy")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sección Estado */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Estado del Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div>
                    <Label className="font-medium">Activo</Label>
                    <p className="text-sm text-muted-foreground">¿El tour está disponible?</p>
                  </div>
                  <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value !== false} onCheckedChange={field.onChange} />}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div>
                    <Label className="font-medium">Reservable</Label>
                    <p className="text-sm text-muted-foreground">¿Permite reservas?</p>
                  </div>
                  <Controller
                    name="isBookable"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value !== false} onCheckedChange={field.onChange} />}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div>
                    <Label className="font-medium">Confirmación Instantánea</Label>
                    <p className="text-sm text-muted-foreground">¿Se confirma la reserva automáticamente?</p>
                  </div>
                  <Controller
                    name="instantConfirmation"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value || false} onCheckedChange={field.onChange} />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/tours")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creando..." : "Crear Tour"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </SidebarInset>
  )
}
