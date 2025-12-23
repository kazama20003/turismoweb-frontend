"use client"

import type * as React from "react"
import { Plane, Bus, Users, BarChart3, Ticket, LifeBuoy, MessageSquare, Globe, TicketPercent } from "lucide-react"

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
import Link from "next/link"

const navigationData = {
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
          title: "Confirmadas",
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
      ],
    },
    {
      title: "Ofertas",
      url: "/dashboard/offers",
      icon: TicketPercent,
      items: [
        {
          title: "General",
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
      name: "Cupones de descuento",
      url: "/dashboard/offers",
      icon: Plane,
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
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Globe className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Peru Travel</span>
                  <span className="truncate text-xs">Turismo y Transporte</span>
                </div>
              </Link>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
