import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, DollarSign, Star, ArrowUpRight, MoreHorizontal, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function HotelAlliancesPage() {
  const hotels = [
    {
      id: "HT001",
      name: "Hotel Caribe Luxury",
      city: "Cartagena",
      stars: 5,
      rooms: 250,
      booked: 198,
      price: "$280",
      rating: 4.8,
      status: "Activo",
    },
    {
      id: "HT002",
      name: "Resort Tayrona",
      city: "Santa Marta",
      stars: 5,
      rooms: 180,
      booked: 165,
      price: "$320",
      rating: 4.9,
      status: "Activo",
    },
    {
      id: "HT003",
      name: "Hotel Andino",
      city: "Bogotá",
      stars: 4,
      rooms: 320,
      booked: 287,
      price: "$150",
      rating: 4.6,
      status: "Activo",
    },
    {
      id: "HT004",
      name: "Boutique San Blas",
      city: "Medellín",
      stars: 4,
      rooms: 95,
      booked: 95,
      price: "$200",
      rating: 4.7,
      status: "Lleno",
    },
    {
      id: "HT005",
      name: "Hotel Playa Blanca",
      city: "Providencia",
      stars: 3,
      rooms: 120,
      booked: 45,
      price: "$120",
      rating: 4.4,
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
                  <h1 className="text-xl font-semibold">Alianzas Hoteleras</h1>
                  <p className="text-sm text-muted-foreground">Gestión de hoteles y alojamientos asociados</p>
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
                  <CardTitle className="text-sm font-medium">Hoteles Asociados</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+8.2%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Habitaciones</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18,542</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+12.5%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2.8M</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+24.3%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7/5</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+0.3</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Hotels Table */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hoteles Disponibles</CardTitle>
                    <CardDescription>Listado de hoteles asociados y disponibilidad</CardDescription>
                  </div>
                  <Button>Agregar Hotel</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar hotel, ciudad o nombre..." className="flex-1" />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Hotel</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Estrellas</TableHead>
                        <TableHead>Ocupación</TableHead>
                        <TableHead>Precio Noche</TableHead>
                        <TableHead>Calificación</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotels.map((hotel) => (
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">{hotel.id}</TableCell>
                          <TableCell>{hotel.name}</TableCell>
                          <TableCell>{hotel.city}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {[...Array(hotel.stars)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(hotel.booked / hotel.rooms) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs">
                                {hotel.booked}/{hotel.rooms}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{hotel.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{hotel.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                hotel.status === "Activo"
                                  ? "default"
                                  : hotel.status === "Lleno"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {hotel.status}
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
