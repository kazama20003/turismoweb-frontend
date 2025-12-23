"use client"

import { Badge } from "@/components/ui/badge"

interface RecentActivityProps {
  orders: Array<{
    id: string
    customerName: string
    total: number
    currency: string
    paymentStatus: string
    status: string
    createdAt: string
  }>
}

export function RecentActivity({ orders }: RecentActivityProps) {
  if (!orders || orders.length === 0) {
    return <div className="text-sm text-muted-foreground">Sin actividad reciente</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
      {orders.slice(0, 10).map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium text-sm">{order.customerName}</p>
            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("es-ES")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {order.total} {order.currency}
            </span>
            <Badge variant="outline" className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
