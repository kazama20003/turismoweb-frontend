"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/use-vehicles"
import { useUploadImage, useDeleteImage } from "@/hooks/use-uploads"
import type { Vehicle, VehicleImage } from "@/types/vehicle"

interface VehicleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle
}

export function VehicleFormDialog({ open, onOpenChange, vehicle }: VehicleFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    plate: "",
    capacity: 0,
    isActive: true,
  })
  const [images, setImages] = useState<VehicleImage[]>([])

  const createMutation = useCreateVehicle()
  const updateMutation = useUpdateVehicle()
  const uploadMutation = useUploadImage()
  const deleteMutation = useDeleteImage()

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        isActive: vehicle.isActive,
      })
      setImages(vehicle.images || [])
    } else {
      setFormData({
        name: "",
        brand: "",
        model: "",
        plate: "",
        capacity: 0,
        isActive: true,
      })
      setImages([])
    }
  }, [vehicle, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number.parseInt(value) : value,
    }))
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
    if (!formData.name || !formData.brand || !formData.model || !formData.plate) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const payload = {
      ...formData,
      images: images.map((img) => ({ url: img.url, publicId: img.publicId })),
    }

    try {
      if (vehicle) {
        await updateMutation.trigger({ id: vehicle._id, data: payload })
      } else {
        await createMutation.trigger(payload)
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving vehicle:", error)
    }
  }

  const isLoading = createMutation.isMutating || updateMutation.isMutating || uploadMutation.isMutating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}</DialogTitle>
          <DialogDescription>
            {vehicle ? "Actualiza la información del vehículo" : "Crea un nuevo vehículo en la flota"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Información Básica</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ej: Bus Turístico Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mercedes">Mercedes</SelectItem>
                    <SelectItem value="Volvo">Volvo</SelectItem>
                    <SelectItem value="Ford">Ford</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="Scania">Scania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="ej: Sprinter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  name="plate"
                  value={formData.plate}
                  onChange={handleInputChange}
                  placeholder="ej: ABC-1234"
                />
              </div>
            </div>
          </div>

          {/* Capacidad y estado */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Capacidad y Estado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad (pasajeros)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="ej: 45"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Disponibilidad</Label>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === "active" }))}
                >
                  <SelectTrigger id="isActive">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Disponible - Listo para operar</SelectItem>
                    <SelectItem value="inactive">No disponible - En mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Imágenes</h3>
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploadMutation.isMutating}
                className="block w-full text-sm text-muted-foreground cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">JPG, JPEG, PNG o WEBP. Máximo 5MB por imagen.</p>
            </div>

            {/* Vista previa de imágenes */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={`${image.publicId}-${image.url}-${index}`} className="relative group">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt="Vehicle"
                      width={120}
                      height={120}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
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
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {vehicle ? "Actualizando..." : "Creando..."}
              </>
            ) : vehicle ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
