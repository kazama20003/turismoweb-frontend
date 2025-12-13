export type OfferType = "percentage" | "fixed"
export type OfferProductType = "tour" | "transport"

export interface ApplicableItem {
  itemId: string
  productType: OfferProductType
}

export interface Offer {
  _id: string
  code: string
  title: string
  description?: string
  type: OfferType
  value: number
  minTotal?: number
  minPeople?: number
  maxUses?: number
  usedCount?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
  appliesToAll?: boolean
  applicableItems?: ApplicableItem[]
  createdAt?: string
  updatedAt?: string
}

export type CreateOfferDto = Omit<Offer, "_id" | "createdAt" | "updatedAt" | "usedCount">
export type UpdateOfferDto = Partial<CreateOfferDto>

export interface OfferValidationResult {
  isValid: boolean
  message?: string
  discount?: number
  finalPrice?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
