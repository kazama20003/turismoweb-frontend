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

export interface Image {
  url: string
  publicId: string
  _id: string
}

export interface Product {
  _id: string
  title: string
  description?: string
  images?: Image[]
  videoUrl?: string
  locationName?: string
  durationDays?: number
  difficulty?: string
  minAge?: number
  capacity?: number
  startTime?: string
  benefits?: string[]
  preparations?: string[]
  itinerary?: Array<{
    day?: number
    title?: string
    description?: string
    activities?: string[]
  }>
  hasTransport?: boolean
  vehicleIds?: string[]
  hasGuide?: boolean
  currentPrice?: number
  discounts?: Array<{
    offerId?: string
    type?: string
    value?: number
  }>
  availabilityType?: string
  availableDates?: string[]
  limitCapacity?: boolean
  minPeoplePerBooking?: number
  maxPeoplePerBooking?: number
  cutoffHoursBeforeStart?: number
  instantConfirmation?: boolean
  isBookable?: boolean
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  languages?: string[]
  rating?: number
  reviewsCount?: number
  cancellationPolicy?: string
  refundPolicy?: string
  changePolicy?: string
  isActive?: boolean
  slug?: string
  translations?: Array<{
    locale?: string
    title?: string
    description?: string
  }>
  createdAt?: string
  updatedAt?: string
}

export interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  authProvider?: string
  externalId?: string
  isActive?: boolean
  roles?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Tour {
  _id: string
  title: string
  description?: string
  images?: Image[]
  videoUrl?: string
  locationName?: string
  durationDays?: number
  difficulty?: string
  minAge?: number
  capacity?: number
  startTime?: string
  benefits?: string[]
  preparations?: string[]
  itinerary?: Array<{
    day?: number
    title?: string
    description?: string
    activities?: string[]
  }>
  hasTransport?: boolean
  vehicleIds?: string[]
  hasGuide?: boolean
  currentPrice?: number
  discounts?: Array<{
    offerId?: string
    type?: string
    value?: number
  }>
  availabilityType?: string
  availableDates?: string[]
  limitCapacity?: boolean
  minPeoplePerBooking?: number
  maxPeoplePerBooking?: number
  cutoffHoursBeforeStart?: number
  instantConfirmation?: boolean
  isBookable?: boolean
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  languages?: string[]
  rating?: number
  reviewsCount?: number
  cancellationPolicy?: string
  refundPolicy?: string
  changePolicy?: string
  isActive?: boolean
  slug?: string
  translations?: Array<{
    locale?: string
    title?: string
    description?: string
  }>
  createdAt?: string
  updatedAt?: string
}

export interface Transport {
  _id: string
  origin?: {
    name?: string
    address?: string
  }
  destination?: {
    name?: string
    address?: string
  }
  vehicleType?: string
  capacity?: number
  currentPrice?: number
  pricePerPerson?: boolean
  images?: Image[]
  slug?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  productId: string
  productType: "Tour" | "Transport"
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

export interface CreateOrderItem {
  productId: string
  productType: "Tour" | "Transport"
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

export interface CreateOrderDto {
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: CreateOrderItem[]
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
}

export type UpdateOrderDto = Partial<CreateOrderDto>

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
