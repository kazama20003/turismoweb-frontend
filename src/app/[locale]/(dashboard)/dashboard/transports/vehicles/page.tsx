"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, Car, Users, CheckCircle, AlertTriangle, Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useVehicles, useDeleteVehicle } from "@/hooks/use-vehicles"
import { useDeleteImage } from "@/hooks/use-uploads"
import { VehicleFormDialog } from "@/components/dashboard/transports/vehicles/vehicle-form-dialog"
import type { Vehicle } from "@/types/vehicle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterBrand, setFilterBrand] = useState("all")
  const page = 1
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: vehiclesData, isLoading } = useVehicles(page, 10)
  const deleteVehicleMutation = useDeleteVehicle()
  const deleteImageMutation = useDeleteImage()

  const vehicles = vehiclesData?.data || []
  const meta = vehiclesData?.meta

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && vehicle.isActive) ||
      (filterStatus === "inactive" && !vehicle.isActive)

    const matchesBrand = filterBrand === "all" || vehicle.brand === filterBrand

    return matchesSearch && matchesStatus && matchesBrand
  })

  const totalVehicles = meta?.total || 0
  const activeVehicles = vehicles.filter((v) => v.isActive).length
  const inactiveVehicles = vehicles.filter((v) => !v.isActive).length
  const totalCapacity = vehicles.reduce((acc, v) => acc + v.capacity, 0)

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return

    setIsDeleting(true)

    try {
      if (vehicleToDelete.images && vehicleToDelete.images.length > 0) {
        for (const image of vehicleToDelete.images) {
          if (image.publicId) {
            console.log("[v0] Deleting image:", image.publicId)
            try {
              await deleteImageMutation.trigger(image.publicId)
              console.log("[v0] Image deleted successfully:", image.publicId)
            } catch (imgError) {
              console.error("[v0] Error deleting image:", image.publicId, imgError)
              // Continue with other images even if one fails
            }
          }
        }
      }

      // Delete the vehicle after images are deleted
      console.log("[v0] Deleting vehicle:", vehicleToDelete._id)
      await deleteVehicleMutation.trigger(vehicleToDelete._id)
      console.log("[v0] Vehicle deleted successfully")
    } catch (error) {
      console.error("[v0] Error during deletion:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
    }
  }

  const handleNewVehicle = () => {
    setSelectedVehicle(undefined)
    setDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedVehicle(undefined)
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
                <h1 className="text-xl font-semibold">Flota de Vehículos</h1>
                <p className="text-sm text-muted-foreground">Gestión de vehículos de transporte turístico</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Disponibles</SelectItem>
                    <SelectItem value="inactive">No disponibles</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleNewVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Vehículo
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVehicles}</div>
                <p className="text-xs text-muted-foreground mt-1">en la flota</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeVehicles}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="text-emerald-500">
                    {totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0}%
                  </span>{" "}
                  listos para operar
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No Disponibles</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveVehicles}</div>
                <p className="text-xs text-muted-foreground mt-1">en mantenimiento o fuera de servicio</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCapacity}</div>
                <p className="text-xs text-muted-foreground mt-1">pasajeros</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Buscar Vehículos</CardTitle>
              <CardDescription>Filtra por nombre, marca, modelo o placa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Buscar vehículo..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    <SelectItem value="Mercedes">Mercedes</SelectItem>
                    <SelectItem value="Volvo">Volvo</SelectItem>
                    <SelectItem value="Ford">Ford</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="Scania">Scania</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Cargando vehículos...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No se encontraron vehículos</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <Card
                  key={vehicle._id}
                  className="border-border/40 bg-card/50 backdrop-blur hover:bg-card/70 transition-colors overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={vehicle.images[0]?.url || "/placeholder.svg?height=200&width=300&query=vehicle"}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={vehicle.isActive ? "default" : "secondary"}
                        className={
                          vehicle.isActive
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-amber-500 hover:bg-amber-600 text-white"
                        }
                      >
                        {vehicle.isActive ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                        <CardDescription>
                          {vehicle.isActive ? "Listo para asignar a tours" : "En mantenimiento o reparación"}
                        </CardDescription>
                      </div>
                      <Car className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Marca</p>
                        <p className="font-medium">{vehicle.brand}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Modelo</p>
                        <p className="font-medium">{vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Placa</p>
                        <p className="font-medium">{vehicle.plate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Capacidad</p>
                        <p className="font-medium">{vehicle.capacity} pasajeros</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDeleteClick(vehicle)}
                        disabled={deleteVehicleMutation.isMutating || deleteImageMutation.isMutating || isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <VehicleFormDialog open={dialogOpen} onOpenChange={handleDialogClose} vehicle={selectedVehicle} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el vehículo{" "}
              <span className="font-semibold">{vehicleToDelete?.name}</span>? Esta acción no se puede deshacer y también
              se eliminarán todas las imágenes asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
