import { api } from "@/lib/api"

// Tipos mínimos seguros que coinciden con tu backend NestJS actual
export interface RecentOrder {
  _id: string
  code: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

export interface RecentPayment {
  _id: string
  transactionId: string
  orderCode: string
  amount: number
  status: string
  createdAt: string
}

export interface DashboardSummary {
  totalUsers: number
  totalOrders: number
  totalSales: number
  averageTicket: number
  totalPendingPayments: number

  ordersByStatus: Array<{ _id: string; count: number }>
  paymentsByStatus: Array<{ _id: string; count: number }>

  topTours: Array<{ _id: string; count: number; revenue: number; title: string }>
  topTransports: Array<{ _id: string; count: number; revenue: number; title: string }>
  topCustomers: Array<{ _id: string; customerName: string; ordersCount: number; totalSpent: number }>

  salesByDay: Array<{ _id: string; total: number; count: number }>

  recentOrders: RecentOrder[]
  recentPayments: RecentPayment[]
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary")
    return response.data
  },
}
