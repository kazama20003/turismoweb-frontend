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
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTour, useUpdateTourTranslation, SUPPORTED_LANGUAGES, type SupportedLanguageCode } from "@/hooks/use-tours"
import { toast } from "sonner"
import type { UpdateTourTranslationDto } from "@/types/tour"

export default function EditTourTranslationPage() {
  const router = useRouter()
  const params = useParams()
  const tourId = params.id as string

  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>("en")

  const { data: tour, isLoading } = useTour(tourId, selectedLang)
  const updateTranslationMutation = useUpdateTourTranslation()

  const [formData, setFormData] = useState<UpdateTourTranslationDto>({
    title: "",
    description: "",
    slug: "",
    meetingPoint: "",
    metaDescription: "",
    includes: [],
    excludes: [],
    categories: [],
    itinerary: [],
  })

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || "",
        description: tour.description || "",
        slug: tour.slug || "",
        meetingPoint: tour.meetingPoint || "",
        metaDescription: tour.metaDescription || "",
        includes: tour.includes || [],
        excludes: tour.excludes || [],
        categories: tour.categories || [],
        itinerary:
          tour.itinerary?.map((item) => ({
            order: item.order,
            title: item.title,
            description: item.description,
          })) || [],
      })
    }
  }, [tour])

  const handleArrayInput = (field: keyof UpdateTourTranslationDto, value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, [field]: items }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateTranslationMutation.trigger({ id: tourId, lang: selectedLang, data: formData })
      toast.success("Traducción actualizada correctamente")
      router.push("/dashboard/tours")
    } catch {
      toast.error("Error al actualizar la traducción")
    }
  }

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </SidebarInset>
    )
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
                  <Link href="/dashboard/tours">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Editar Traducción del Tour</h1>
                  <p className="text-sm text-muted-foreground">Actualiza la traducción en diferentes idiomas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedLang} onValueChange={(value) => setSelectedLang(value as SupportedLanguageCode)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSubmit} disabled={updateTranslationMutation.isMutating}>
                  {updateTranslationMutation.isMutating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar Traducción
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Translatable Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Campos Traducibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingPoint">Punto de encuentro</Label>
                  <Input
                    id="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta descripción</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="includes">Incluye (separado por comas)</Label>
                  <Textarea
                    id="includes"
                    value={formData.includes?.join(", ")}
                    onChange={(e) => handleArrayInput("includes", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excludes">No incluye (separado por comas)</Label>
                  <Textarea
                    id="excludes"
                    value={formData.excludes?.join(", ")}
                    onChange={(e) => handleArrayInput("excludes", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories">Categorías (separado por comas)</Label>
                  <Input
                    id="categories"
                    value={formData.categories?.join(", ")}
                    onChange={(e) => handleArrayInput("categories", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Non-editable Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información General (Solo lectura)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Ubicación</Label>
                    <Input value={tour?.locationName || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Duración (días)</Label>
                    <Input value={tour?.durationDays || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <Input value={`$${tour?.currentPrice || 0}`} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </SidebarInset>
  )
}
