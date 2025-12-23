"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, Plane, MoreHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardSummary } from "@/hooks/use-dashboard-summary"
import { MetricCard } from "@/components/dashboard/metric-card"
import { BookingsChart } from "@/components/dashboard/bookings-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PopularDestinations } from "@/components/dashboard/popular-destinations"

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary()
  const [period, setPeriod] = useState("7d")

  const confirmedOrders = summary?.ordersByStatus?.find((s) => s._id === "confirmed")?.count ?? 0
  const totalOrders = summary?.totalOrders ?? 0
  const totalSales = summary?.totalSales ?? 0
  const totalUsers = summary?.totalUsers ?? 0

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-xl font-semibold">Panel de Control</h1>
                <p className="text-sm text-muted-foreground">Resumen de actividad turística</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Últimas 24 horas</SelectItem>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 90 días</SelectItem>
                  </SelectContent>
                </Select>
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
            <MetricCard
              title="Total Reservas"
              value={isLoading ? "..." : totalOrders}
              icon={Calendar}
              change={12.5}
              trend="up"
            />
            <MetricCard
              title="Ingresos"
              value={isLoading ? "..." : `$${totalSales.toLocaleString("es-ES")}`}
              icon={DollarSign}
              change={18.2}
              trend="up"
            />
            <MetricCard
              title="Tours Activos"
              value={isLoading ? "..." : (summary?.topTours?.length ?? 0)}
              icon={Plane}
              change={-3.1}
              trend="down"
            />
            <MetricCard
              title="Clientes Activos"
              value={isLoading ? "..." : totalUsers}
              icon={Users}
              change={8.7}
              trend="up"
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Reservas por Día</CardTitle>
                <CardDescription>Tendencia de reservas en los últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Cargando...</div>
                ) : (
                  <BookingsChart data={summary?.salesByDay ?? []} />
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Ingresos Diarios</CardTitle>
                <CardDescription>Evolución de ingresos en los últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Cargando...</div>
                ) : (
                  <RevenueChart data={summary?.salesByDay ?? []} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas transacciones y reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity
                      orders={
                        summary?.recentOrders?.map((o) => ({
                          id: o._id,
                          customerName: o.customerName,
                          total: o.totalAmount,
                          currency: "USD", // Ajusta según lo que use tu plataforma
                          paymentStatus: o.status,
                          status: o.status,
                          createdAt: o.createdAt,
                        })) ?? []
                      }
                    />


              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Destinos Populares</CardTitle>
                <CardDescription>Los destinos más reservados este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <PopularDestinations tours={summary?.topTours ?? []} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarInset>
  )
}
