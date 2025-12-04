"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  ArrowUpRight,
  Loader2,
  Eye,
  Edit,
  Send,
  Trash2,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import type { User } from "@/types/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useUsers, useDeleteUser } from "@/hooks/use-users"

function getProviderBadge(provider: string) {
  switch (provider.toLowerCase()) {
    case "google":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          Google
        </Badge>
      )
    case "facebook":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Facebook
        </Badge>
      )
    case "local":
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
          Local
        </Badge>
      )
    default:
      return <Badge variant="outline">Desconocido</Badge>
  }
}

export default function ClientsPage() {
  const router = useRouter()
  const { data: usersData, isLoading: loading } = useUsers()
  const deleteUserMutation = useDeleteUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    google: 0,
    facebook: 0,
    local: 0,
  })

  useEffect(() => {
    if (usersData?.data) {
      const users = usersData.data
      setStats({
        total: users.length,
        google: users.filter((u: User) => u.authProvider === "google").length,
        facebook: users.filter((u: User) => u.authProvider === "facebook").length,
        local: users.filter((u: User) => u.authProvider === "local").length,
      })
    }
  }, [usersData])

  const handleDeleteUser = async (userId: string) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success("Cliente eliminado correctamente")
      },
      onError: () => {
        toast.error("Error al eliminar el cliente")
      },
    })
  }

  const filteredClients =
    usersData?.data?.filter(
      (client: User) =>
        (client.firstName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.lastName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-xl font-semibold">Gestión de Clientes</h1>
                <p className="text-sm text-muted-foreground">Administra tu base de clientes</p>
              </div>
              <Button onClick={() => router.push("/dashboard/users/new")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">+8.7%</span> vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Google</CardTitle>
                <Mail className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.google}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.google / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facebook</CardTitle>
                <Mail className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.facebook}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.facebook / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Local</CardTitle>
                <Shield className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.local}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.local / stats.total) * 100).toFixed(1) : 0}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Clients Table */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Clientes</CardTitle>
                  <CardDescription>Gestiona y visualiza todos tus clientes</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar clientes..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Proveedor</TableHead>
                          <TableHead>Registro</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>País</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              No se encontraron clientes
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredClients.map((client: User) => (
                            <TableRow key={client._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src="/placeholder.svg"
                                      alt={`${client.firstName} ${client.lastName}`}
                                    />
                                    <AvatarFallback>
                                      {`${client.firstName || "U"} ${client.lastName || ""}`
                                        .trim()
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {`${client.firstName || ""} ${client.lastName || ""}`.trim() || "Sin nombre"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{client._id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{client.email || "-"}</TableCell>
                              <TableCell>{getProviderBadge(client.authProvider)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(client.createdAt).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={client.roles?.[0] === "ADMIN" ? "default" : "outline"}>
                                  {client.roles?.[0] || "USER"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{client.country || "-"}</TableCell>
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
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${client._id}`)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ver detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/dashboard/users/${client._id}/edit`)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar cliente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Send className="mr-2 h-4 w-4" />
                                      Enviar mensaje
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                      onClick={() => handleDeleteUser(client._id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar cliente
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredClients.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">No se encontraron clientes</div>
                    ) : (
                      filteredClients.map((client: User) => (
                        <Card key={client._id} className="border-border/40">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src="/placeholder.svg" alt={`${client.firstName} ${client.lastName}`} />
                                  <AvatarFallback>
                                    {`${client.firstName || "U"} ${client.lastName || ""}`
                                      .trim()
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {`${client.firstName || ""} ${client.lastName || ""}`.trim() || "Sin nombre"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{client.email || "-"}</div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${client._id}/edit`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${client._id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar cliente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar mensaje
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                    onClick={() => handleDeleteUser(client._id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar cliente
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Proveedor:</span>
                                {getProviderBadge(client.authProvider)}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Rol:</span>
                                <Badge variant={client.roles?.[0] === "ADMIN" ? "default" : "outline"}>
                                  {client.roles?.[0] || "USER"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">País:</span>
                                <span>{client.country || "-"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Registro:</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(client.createdAt).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarInset>
  )
}
