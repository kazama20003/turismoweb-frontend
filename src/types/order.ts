export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export interface OrderItem {
  productId: string
  productType: "tour" | "transport"
  travelDate?: string
  adults?: number
  children?: number
  infants?: number
  unitPrice: number
  totalPrice: number
  appliedOfferId?: string
  notes?: string
  addedAt?: string
}

export interface Order {
  _id: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: OrderItem[]
  subtotal: number
  discountTotal?: number
  grandTotal: number
  currency?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  notes?: string
  confirmationCode?: string
  cartId?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateOrderDto = Omit<Order, "_id" | "createdAt" | "updatedAt">
export type UpdateOrderDto = Partial<CreateOrderDto>

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
