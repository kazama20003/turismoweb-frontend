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
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  Edit,
  Eye,
  Trash2,
  Languages,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  useTours,
  useDeleteTour,
  useAutoTranslateTour,
  SUPPORTED_LANGUAGES,
  type SupportedLanguageCode,
} from "@/hooks/use-tours"
import type { Tour } from "@/types/tour"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ToursPage() {
  const router = useRouter()
  const { data: toursData, isLoading } = useTours()
  const deleteTourssMutation = useDeleteTour()
  const autoTranslateMutation = useAutoTranslateTour()

  const [searchQuery, setSearchQuery] = useState("")
  const [showTranslateDialog, setShowTranslateDialog] = useState(false)
  const [selectedTourForTranslation, setSelectedTourForTranslation] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<SupportedLanguageCode[]>([])

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalCapacity: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (toursData?.data) {
      const tours = toursData.data
      const activeCount = tours.filter((t: Tour) => t.isActive !== false).length
      const capacitySum = tours.reduce((sum: number, t: Tour) => sum + (t.capacity || 0), 0)
      const revenueSum = tours.reduce((sum: number, t: Tour) => sum + (t.currentPrice || 0), 0)

      setStats({
        total: tours.length,
        active: activeCount,
        totalCapacity: capacitySum,
        totalRevenue: revenueSum,
      })
    }
  }, [toursData])

  const handleDeleteTour = async (tourId: string) => {
    deleteTourssMutation.trigger(tourId)
    toast.success("Tour eliminado correctamente")
  }

  const handleAutoTranslate = async () => {
    if (!selectedTourForTranslation || selectedLanguages.length === 0) {
      toast.error("Por favor selecciona al menos un idioma")
      return
    }

    try {
      await autoTranslateMutation.trigger({ id: selectedTourForTranslation, languages: selectedLanguages })
      toast.success("Tour traducido correctamente")
      setShowTranslateDialog(false)
      setSelectedTourForTranslation(null)
      setSelectedLanguages([])
    } catch {
      toast.error("Error al traducir el tour")
    }
  }

  const openTranslateDialog = (tourId: string) => {
    setSelectedTourForTranslation(tourId)
    setShowTranslateDialog(true)
  }

  const toggleLanguage = (lang: SupportedLanguageCode) => {
    setSelectedLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  const filteredTours =
    toursData?.data?.filter(
      (tour: Tour) =>
        (tour.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.locationName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const getStatusBadge = (isActive?: boolean) => {
    if (isActive === false) {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
          Inactivo
        </Badge>
      )
    }
    return (
      <Badge
        variant="default"
        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
      >
        Activo
      </Badge>
    )
  }

  const getOccupancyColor = (booked: number, capacity?: number) => {
    if (!capacity) return "text-muted-foreground"
    const percentage = (booked / capacity) * 100
    if (percentage >= 90) return "text-emerald-500"
    if (percentage >= 70) return "text-blue-500"
    if (percentage >= 50) return "text-amber-500"
    return "text-muted-foreground"
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
                <h1 className="text-xl font-semibold">Tours y Experiencias</h1>
                <p className="text-sm text-muted-foreground">Gestiona todos los tours disponibles</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/tours/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Tour
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
                <CardTitle className="text-sm font-medium">Tours Totales</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-sm font-medium">Tours Activos</CardTitle>
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
                <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCapacity}</div>
                <p className="text-xs text-muted-foreground">personas disponibles</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Tours</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">+15.2%</span> vs mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tours Table */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Tours</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar tours..."
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
                      <TableHead>Nombre del Tour</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Ocupación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTours.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No se encontraron tours
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTours.map((tour: Tour) => (
                        <TableRow key={tour._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{tour.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{tour.locationName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {tour.durationDays}d {tour.durationHours || 0}h
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${tour.currentPrice}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className={getOccupancyColor(0, tour.capacity)}>0/{tour.capacity || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(tour.isActive)}</TableCell>
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
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/tours/${tour._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/tours/${tour._id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar tour
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openTranslateDialog(tour._id)}>
                                  <Languages className="mr-2 h-4 w-4" />
                                  Traducir automáticamente
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                  onClick={() => handleDeleteTour(tour._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar tour
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

      {/* Translation Dialog - Updated with all 9 supported languages */}
      <AlertDialog open={showTranslateDialog} onOpenChange={setShowTranslateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Traducir Tour Automáticamente</AlertDialogTitle>
            <AlertDialogDescription>Selecciona los idiomas a los que deseas traducir este tour.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            {SUPPORTED_LANGUAGES.filter((lang) => lang.code !== "es").map((lang) => (
              <div key={lang.code} className="flex items-center gap-2">
                <Checkbox
                  id={`lang-${lang.code}`}
                  checked={selectedLanguages.includes(lang.code)}
                  onCheckedChange={() => toggleLanguage(lang.code)}
                />
                <Label htmlFor={`lang-${lang.code}`} className="cursor-pointer">
                  {lang.name}
                </Label>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAutoTranslate} disabled={autoTranslateMutation.isMutating}>
              {autoTranslateMutation.isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traduciendo...
                </>
              ) : (
                "Traducir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
