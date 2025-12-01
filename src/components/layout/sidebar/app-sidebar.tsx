"use client"

import type * as React from "react"
import {
  Plane,
  Bus,
  Hotel,
  Users,
  BarChart3,
  Ticket,
  Settings2,
  LifeBuoy,
  MessageSquare,
  Globe,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationData = {
  user: {
    name: "Usuario Admin",
    email: "admin@tourism.com",
    avatar: "/avatars/admin.jpg",
  },
  mainNavigation: [
    {
      title: "Panel Principal",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Resumen General",
          url: "/dashboard",
        },
        {
          title: "Analíticas",
          url: "/dashboard",
        },
        {
          title: "Reportes",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Reservas",
      url: "/dashboard/bookings",
      icon: Ticket,
      items: [
        {
          title: "Todas las Reservas",
          url: "/dashboard/bookings",
        },
        {
          title: "Pendientes",
          url: "/dashboard/bookings",
        },
        {
          title: "Confirmadas",
          url: "/dashboard/bookings",
        },
        {
          title: "Canceladas",
          url: "/dashboard/bookings",
        },
      ],
    },
    {
      title: "Transporte",
      url: "/dashboard/transports",
      icon: Bus,
      items: [
        {
          title: "Vehículos",
          url: "/dashboard/transports/vehicles",
        },
        {
          title: "Rutas",
          url: "/dashboard/transports",
        },
        {
          title: "Horarios",
          url: "/dashboard/transports",
        },
        {
          title: "Conductores",
          url: "/dashboard/transports",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Todos los Clientes",
          url: "/dashboard/users",
        },
        {
          title: "Crear Nuevo Usuario",
          url: "/dashboard/users/new",
        },
        {
          title: "Reseñas",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/dashboard/config",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/config",
        },
        {
          title: "Precios",
          url: "/dashboard/config",
        },
        {
          title: "Notificaciones",
          url: "/dashboard/config",
        },
        {
          title: "Integraciones",
          url: "/dashboard/config",
        },
      ],
    },
  ],
  secondaryNavigation: [
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Comentarios",
      url: "#",
      icon: MessageSquare,
    },
  ],
  projectsList: [
    {
      name: "Servicios de Vuelo",
      url: "#",
      icon: Plane,
    },
    {
      name: "Alianzas Hoteleras",
      url: "#",
      icon: Hotel,
    },
    {
      name: "Paquetes Turísticos",
      url: "/dashboard/tours",
      icon: Globe,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Globe className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TravelHub</span>
                  <span className="truncate text-xs">Turismo y Transporte</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.mainNavigation} />
        <NavProjects projects={navigationData.projectsList} />
        <NavSecondary items={navigationData.secondaryNavigation} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
