import {  SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings, Lock, Bell, Key, Palette, CheckCircle, Users, Globe } from "lucide-react"

export default function ConfigPage() {
  return (

      <SidebarInset>
        <div className="m-4 rounded-lg overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-xl font-semibold">Configuración</h1>
                  <p className="text-sm text-muted-foreground">Gestiona la plataforma de turismo y transporte</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-6 p-6 bg-background/50 backdrop-blur rounded-b-lg">
            {/* Status Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proveedores OAuth</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3/3</div>
                  <p className="text-xs text-muted-foreground mt-1">Google, Facebook, Email activos</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Integraciones</CardTitle>
                  <Globe className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground mt-1">Servicios conectados</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Conectados</CardTitle>
                  <Users className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground mt-1">Usuarios activos</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100%</div>
                  <p className="text-xs text-muted-foreground mt-1">Operativo</p>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Sections */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* General Settings */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-500" />
                    <div>
                      <CardTitle>General</CardTitle>
                      <CardDescription>Configuración básica</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Nombre de la Plataforma</Label>
                    <Input id="app-name" defaultValue="TravelHub" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">UTC-5 (Colombia)</SelectItem>
                        <SelectItem value="utc-6">UTC-6 (México)</SelectItem>
                        <SelectItem value="utc-3">UTC-3 (Argentina)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Guardar</Button>
                </CardContent>
              </Card>

              {/* Authentication */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle>Autenticación</CardTitle>
                      <CardDescription>Proveedores OAuth</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Google OAuth</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facebook OAuth</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email/Contraseña</span>
                    <Switch defaultChecked />
                  </div>
                  <Button className="w-full">Guardar</Button>
                </CardContent>
              </Card>

              {/* API Keys */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-emerald-500" />
                    <div>
                      <CardTitle>Claves API</CardTitle>
                      <CardDescription>Gestión de credenciales</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Clave Pública</Label>
                    <Input type="password" value="pk_live_123456" readOnly className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Clave Secreta</Label>
                    <Input type="password" value="sk_live_abcdef" readOnly className="font-mono text-xs" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Regenerar
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    <div>
                      <CardTitle>Notificaciones</CardTitle>
                      <CardDescription>Alertas del sistema</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email de Reservas</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alertas de Transporte</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reportes Semanales</span>
                    <Switch />
                  </div>
                  <Button className="w-full">Guardar</Button>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-500" />
                    <div>
                      <CardTitle>Apariencia</CardTitle>
                      <CardDescription>Personalización</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Guardar</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
  )
}
