"use client"

import type React from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft, Loader2, Mail, Lock, User, Shield } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateUser } from "@/hooks/use-users"
import type { CreateUserDto } from "@/types/user"
import { toast } from "sonner"

const USER_ROLES = ["USER", "ADMIN"]
const AUTH_PROVIDERS = ["local", "google", "facebook"]

export default function NewUserPage() {
  const router = useRouter()
  const createUserMutation = useCreateUser()
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    authProvider: "local",
    roles: ["USER"],
    phone: "",
    country: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Por favor completa los campos requeridos")
      return
    }

    if (formData.authProvider === "local" && !formData.password) {
      toast.error("La contraseña es requerida para autenticación local")
      return
    }

    createUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Cliente creado correctamente")
        router.push("/dashboard/users")
      },
      onError: () => {
        toast.error("Error al crear el cliente")
      },
    })
  }

  return (
    <SidebarInset>
      <div className="m-4 rounded-lg overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-t-lg">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard/users")}
                  className="shrink-0 hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Nuevo Cliente</h1>
                  <p className="text-sm text-muted-foreground">Crea un nuevo cliente en el sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 bg-background/50 backdrop-blur rounded-b-lg">
          <Card className="border-border/40 bg-card/50 backdrop-blur w-full">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UserPlus className="h-6 w-6 text-primary" />
                Información del Cliente
              </CardTitle>
              <CardDescription className="text-base">
                Completa los datos del nuevo cliente. Los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Datos Personales
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        Nombre <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Apellido <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Correo Electrónico <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="juan@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+51 987654321"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        País
                      </Label>
                      <Input
                        id="country"
                        placeholder="Perú"
                        value={formData.country || ""}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Seguridad y Acceso
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">
                        Rol del Usuario
                      </Label>
                      <Select
                        value={formData.roles?.[0] || "USER"}
                        onValueChange={(value) => setFormData({ ...formData, roles: [value] })}
                      >
                        <SelectTrigger id="role" className="w-full">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {USER_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role === "ADMIN" ? "Administrador" : "Usuario"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authProvider" className="text-sm font-medium">
                        Método de Autenticación
                      </Label>
                      <Select
                        value={formData.authProvider}
                        onValueChange={(value) => setFormData({ ...formData, authProvider: value })}
                      >
                        <SelectTrigger id="authProvider" className="w-full">
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local (Email/Contraseña)</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.authProvider === "local" && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required={formData.authProvider === "local"}
                          minLength={6}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/users")}
                    disabled={createUserMutation.isPending}
                    className="w-full sm:w-auto min-w-[140px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="w-full sm:w-auto min-w-[140px]"
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear Cliente
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarInset>
  )
}
