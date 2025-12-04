import {  SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Users, DollarSign, TrendingUp, ArrowUpRight, MoreHorizontal, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FlightServicesPage() {
  const flights = [
    {
      id: "FL001",
      airline: "AeroTur",
      route: "Bogotá → Cartagena",
      departure: "08:00",
      arrival: "09:30",
      capacity: 180,
      booked: 156,
      price: "$450",
      status: "Activo",
    },
    {
      id: "FL002",
      airline: "SkyTravel",
      route: "Medellín → Santa Marta",
      departure: "10:15",
      arrival: "11:45",
      capacity: 150,
      booked: 142,
      price: "$380",
      status: "Activo",
    },
    {
      id: "FL003",
      airline: "AeroTur",
      route: "Bogotá → San Andrés",
      departure: "12:00",
      arrival: "14:30",
      capacity: 200,
      booked: 89,
      price: "$520",
      status: "Activo",
    },
    {
      id: "FL004",
      airline: "TravelAir",
      route: "Cali → Bogotá",
      departure: "14:30",
      arrival: "15:45",
      capacity: 160,
      booked: 160,
      price: "$320",
      status: "Lleno",
    },
    {
      id: "FL005",
      airline: "SkyTravel",
      route: "Barranquilla → Cartagena",
      departure: "16:00",
      arrival: "17:15",
      capacity: 140,
      booked: 45,
      price: "$280",
      status: "Disponible",
    },
  ]

  return (

      <SidebarInset>
        <div className="m-4 rounded-lg overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-xl font-semibold">Servicios de Vuelo</h1>
                  <p className="text-sm text-muted-foreground">Gestión de vuelos y aerolíneas asociadas</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar período" />
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
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vuelos Totales</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+15.3%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pasajeros</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">52,847</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+22.1%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1.2M</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+19.8%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocupación Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+5.2%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Flights Table */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vuelos Disponibles</CardTitle>
                    <CardDescription>Listado de vuelos activos y sus detalles</CardDescription>
                  </div>
                  <Button>Agregar Vuelo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar vuelo, aerolínea o ruta..." className="flex-1" />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Vuelo</TableHead>
                        <TableHead>Aerolínea</TableHead>
                        <TableHead>Ruta</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Llegada</TableHead>
                        <TableHead>Ocupación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flights.map((flight) => (
                        <TableRow key={flight.id}>
                          <TableCell className="font-medium">{flight.id}</TableCell>
                          <TableCell>{flight.airline}</TableCell>
                          <TableCell>{flight.route}</TableCell>
                          <TableCell>{flight.departure}</TableCell>
                          <TableCell>{flight.arrival}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(flight.booked / flight.capacity) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs">
                                {flight.booked}/{flight.capacity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{flight.price}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                flight.status === "Activo"
                                  ? "default"
                                  : flight.status === "Lleno"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {flight.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
  )
}
