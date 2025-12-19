"use client"

import { useState } from "react"
import Link from "next/link"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, MapPin, Clock, Plus, MoreHorizontal, Pencil, Trash2, Eye, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import Image from "next/image"
import { useTransports, useDeleteTransport } from "@/hooks/use-transports"
import { useDeleteImage } from "@/hooks/use-uploads"
import type { Transport, WeekDay } from "@/types/transport"

const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
}

export default function TransportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const page = 1
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transportToDelete, setTransportToDelete] = useState<Transport | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: transportsData, isLoading } = useTransports(page, 10)
  const deleteTransportMutation = useDeleteTransport()
  const deleteImageMutation = useDeleteImage()

  const transports = transportsData || []

  const filteredTransports = transports.filter((transport) => {
    const matchesSearch =
      transport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.destination.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && transport.isActive !== false) ||
      (filterStatus === "inactive" && transport.isActive === false)
    return matchesSearch && matchesStatus
  })

  const totalTransports = transports.length
  const activeTransports = transports.filter((t) => t.isActive !== false).length
  const inactiveTransports = transports.filter((t) => t.isActive === false).length

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A"
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  const handleDeleteClick = (transport: Transport) => {
    setTransportToDelete(transport)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!transportToDelete) return

    setIsDeleting(true)
    try {
      if (transportToDelete.images && transportToDelete.images.length > 0) {
        for (const image of transportToDelete.images) {
          if (image.publicId) {
            try {
              await deleteImageMutation.trigger(image.publicId)
            } catch (error) {
              console.error("Error deleting image:", error)
            }
          }
        }
      }

      await deleteTransportMutation.trigger(transportToDelete._id)
    } catch (error) {
      console.error("Error deleting transport:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setTransportToDelete(null)
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
                <h1 className="text-xl font-semibold">Paquetes de Transporte</h1>
                <p className="text-sm text-muted-foreground">Gestión de servicios y rutas turísticas</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Disponibles</SelectItem>
                    <SelectItem value="inactive">No disponibles</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild>
                  <Link href="/dashboard/transports/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paquete
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paquetes</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransports}</div>
                <p className="text-xs text-muted-foreground mt-1">en el sistema</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paquetes Disponibles</CardTitle>
                <MapPin className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTransports}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="text-emerald-500">
                    {totalTransports > 0 ? Math.round((activeTransports / totalTransports) * 100) : 0}%
                  </span>{" "}
                  listos para reservar
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No Disponibles</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveTransports}</div>
                <p className="text-xs text-muted-foreground mt-1">temporalmente suspendidos</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTransports}</div>
                <p className="text-xs text-muted-foreground mt-1">con servicio activo</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Buscar Paquetes</CardTitle>
              <CardDescription>Filtra por título, origen o destino</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Buscar paquete..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Cargando paquetes de transporte...</p>
            </div>
          ) : filteredTransports.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No se encontraron paquetes de transporte</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTransports.map((transport) => {
                const vehicleInfo = typeof transport.vehicle === "object" ? transport.vehicle : null

                return (
                  <Card
                    key={transport._id}
                    className="border-border/40 bg-card/50 backdrop-blur hover:bg-card/70 transition-colors overflow-hidden"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={
                          transport.images?.[0]?.url ||
                          "/placeholder.svg?height=160&width=320&query=transport route scenic" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={transport.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={transport.isActive !== false ? "default" : "secondary"}
                          className={transport.isActive !== false ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {transport.isActive !== false ? "Disponible" : "No disponible"}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{transport.title}</CardTitle>
                          <CardDescription className="line-clamp-1">
                            {transport.description || "Sin descripción"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-xs">Origen</p>
                            <p className="font-medium">{transport.origin.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-xs">Destino</p>
                            <p className="font-medium">{transport.destination.name}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Duración</p>
                          <p className="font-medium">{formatDuration(transport.durationMinutes)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Capacidad</p>
                          <p className="font-medium">{vehicleInfo?.capacity || "N/A"} pax</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Vehículo</p>
                          <p className="font-medium truncate">{vehicleInfo?.name || "N/A"}</p>
                        </div>
                      </div>

                      <Separator />

                      {transport.availableDays && transport.availableDays.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Días disponibles</p>
                              <div className="flex flex-wrap gap-1">
                                {transport.availableDays.map((day) => (
                                  <Badge key={day} variant="outline" className="text-xs">
                                    {WEEKDAY_LABELS[day]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Precio</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold text-primary">${transport.currentPrice}</p>
                            {transport.oldPrice && (
                              <p className="text-sm text-muted-foreground line-through">${transport.oldPrice}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/dashboard/transports/${transport._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/dashboard/transports/${transport._id}/edit`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDeleteClick(transport)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar paquete de transporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el paquete &quot;{transportToDelete?.title}&quot; y todas sus
              imágenes asociadas. Esta acción no se puede deshacer.
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
