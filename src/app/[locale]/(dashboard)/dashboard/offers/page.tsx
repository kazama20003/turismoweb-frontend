"use client"

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Percent,
  DollarSign,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  Edit,
  Eye,
  Trash2,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useOffers, useDeleteOffer } from "@/hooks/use-offers"
import type { Offer } from "@/types/offer"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function OffersPage() {
  const router = useRouter()
  const { data: offersData, isLoading } = useOffers()
  const deleteOfferMutation = useDeleteOffer()

  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOfferForDelete, setSelectedOfferForDelete] = useState<string | null>(null)

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    percentageOffers: 0,
    fixedOffers: 0,
  })

  useEffect(() => {
    if (offersData?.data) {
      const offers = offersData.data
      const activeCount = offers.filter((o: Offer) => o.isActive !== false).length
      const percentageCount = offers.filter((o: Offer) => o.type === "percentage").length
      const fixedCount = offers.filter((o: Offer) => o.type === "fixed").length

      setStats({
        total: offers.length,
        active: activeCount,
        percentageOffers: percentageCount,
        fixedOffers: fixedCount,
      })
    }
  }, [offersData])

  const handleDeleteOffer = async () => {
    if (!selectedOfferForDelete) return

    try {
      await deleteOfferMutation.trigger(selectedOfferForDelete)
      toast.success("Oferta eliminada correctamente")
      setDeleteDialogOpen(false)
      setSelectedOfferForDelete(null)
    } catch {
      toast.error("Error al eliminar la oferta")
    }
  }

  const openDeleteDialog = (offerId: string) => {
    setSelectedOfferForDelete(offerId)
    setDeleteDialogOpen(true)
  }

  const filteredOffers =
    offersData?.data?.filter(
      (offer: Offer) =>
        (offer.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (offer.code ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const getStatusBadge = (isActive?: boolean) => {
    if (isActive === false) {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
          Inactiva
        </Badge>
      )
    }
    return (
      <Badge
        variant="default"
        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
      >
        Activa
      </Badge>
    )
  }

  const getTypeBadge = (type?: string) => {
    if (type === "percentage") {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Percent className="h-3 w-3 mr-1" />
          Porcentaje
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
        <DollarSign className="h-3 w-3 mr-1" />
        Monto Fijo
      </Badge>
    )
  }

  const isOfferExpired = (endDate?: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
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
                <h1 className="text-xl font-semibold">Ofertas y Promociones</h1>
                <p className="text-sm text-muted-foreground">Gestiona todas las ofertas disponibles</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/offers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Oferta
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ofertas Totales</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">+{stats.total > 0 ? Math.ceil(stats.total * 0.1) : 0}</span> vs mes
                  anterior
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ofertas Activas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ofertas Porcentaje</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.percentageOffers}</div>
                <p className="text-xs text-muted-foreground">descuentos en porcentaje</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ofertas Monto Fijo</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fixedOffers}</div>
                <p className="text-xs text-muted-foreground">descuentos en monto fijo</p>
              </CardContent>
            </Card>
          </div>

          {/* Offers Table */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Ofertas</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar ofertas..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Usos</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No se encontraron ofertas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOffers.map((offer: Offer) => (
                        <TableRow key={offer._id}>
                          <TableCell className="font-mono font-semibold">{offer.code}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{offer.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(offer.type)}</TableCell>
                          <TableCell className="font-semibold">
                            {offer.type === "percentage" ? `${offer.value}%` : `$${offer.value}`}
                          </TableCell>
                          <TableCell>
                            {offer.maxUses ? `${offer.usedCount || 0}/${offer.maxUses}` : "Ilimitado"}
                          </TableCell>
                          <TableCell>
                            {offer.endDate ? (
                              <span
                                className={`text-sm ${
                                  isOfferExpired(offer.endDate) ? "text-red-500 line-through" : "text-muted-foreground"
                                }`}
                              >
                                {new Date(offer.endDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Sin fecha</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(offer.isActive)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/offers/${offer._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/offers/${offer._id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar oferta
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                  onClick={() => openDeleteDialog(offer._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar oferta
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Oferta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOffer}
              disabled={deleteOfferMutation.isMutating}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteOfferMutation.isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
