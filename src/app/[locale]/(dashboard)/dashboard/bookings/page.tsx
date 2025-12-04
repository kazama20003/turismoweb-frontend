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
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useOrders, useDeleteOrder } from "@/hooks/use-orders"
import type { Order, OrderStatus, PaymentStatus } from "@/types/order"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { OrderStatus as OrderStatusEnum, PaymentStatus as PaymentStatusEnum } from "@/types/order"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingsPage() {
  const router = useRouter()
  const { data: ordersData, isLoading } = useOrders()
  const deleteOrderMutation = useDeleteOrder()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState<string | null>(null)

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (ordersData?.data) {
      const orders = ordersData.data
      const confirmedCount = orders.filter((o: Order) => o.status === OrderStatusEnum.CONFIRMED).length
      const pendingCount = orders.filter((o: Order) => o.status === OrderStatusEnum.PENDING).length
      const canceledCount = orders.filter((o: Order) => o.status === OrderStatusEnum.CANCELED).length
      const revenueSum = orders.reduce((sum: number, o: Order) => sum + o.grandTotal, 0)

      setStats({
        total: orders.length,
        confirmed: confirmedCount,
        pending: pendingCount,
        canceled: canceledCount,
        totalRevenue: revenueSum,
      })
    }
  }, [ordersData])

  const handleDeleteOrder = async (orderId: string) => {
    setSelectedOrderForDelete(orderId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedOrderForDelete) return
    try {
      await deleteOrderMutation.trigger(selectedOrderForDelete)
      toast.success("Reserva eliminada correctamente")
      setShowDeleteDialog(false)
      setSelectedOrderForDelete(null)
    } catch {
      toast.error("Error al eliminar la reserva")
    }
  }

  const filteredOrders =
    ordersData?.data?.filter(
      (order: Order) =>
        (statusFilter === "all" || order.status === statusFilter) &&
        ((order.customerName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.customerEmail ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.confirmationCode ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
    ) || []

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatusEnum.CONFIRMED:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmada
          </Badge>
        )
      case OrderStatusEnum.PENDING:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case OrderStatusEnum.CANCELED:
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        )
      case OrderStatusEnum.COMPLETED:
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        )
      default:
        return null
    }
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatusEnum.PAID:
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Pagado
          </Badge>
        )
      case PaymentStatusEnum.PENDING:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pendiente
          </Badge>
        )
      case PaymentStatusEnum.REFUNDED:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Reembolsado
          </Badge>
        )
      case PaymentStatusEnum.FAILED:
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Fallido
          </Badge>
        )
      default:
        return null
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
                <h1 className="text-xl font-semibold">Gestión de Reservas</h1>
                <p className="text-sm text-muted-foreground">Administra todas las reservas de viajes</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/bookings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Reserva
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">+{stats.total > 0 ? Math.ceil(stats.total * 0.15) : 0}</span> vs
                  mes anterior
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.confirmed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.canceled}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.canceled / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">+22.5%</span> vs mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Reservas</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por cliente, email o código..."
                      className="pl-8 w-[280px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value={OrderStatusEnum.CONFIRMED}>Confirmadas</SelectItem>
                      <SelectItem value={OrderStatusEnum.PENDING}>Pendientes</SelectItem>
                      <SelectItem value={OrderStatusEnum.CANCELED}>Canceladas</SelectItem>
                      <SelectItem value={OrderStatusEnum.COMPLETED}>Completadas</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No se encontraron reservas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order: Order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">
                            {order.confirmationCode || order._id.slice(-8)}
                          </TableCell>
                          <TableCell className="font-medium">{order.customerName}</TableCell>
                          <TableCell className="text-sm">{order.customerEmail}</TableCell>
                          <TableCell className="text-sm">{order.items?.length || 0} item(s)</TableCell>
                          <TableCell className="font-semibold">${order.grandTotal.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
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
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${order._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${order._id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar reserva
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                  onClick={() => handleDeleteOrder(order._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar reserva
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
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteOrderMutation.isMutating}>
              {deleteOrderMutation.isMutating ? (
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
