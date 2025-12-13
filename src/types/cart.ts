export interface CartItem {
  _id?: string
  productId:
    | string
    | {
        _id: string
        title: string
        images?: Array<{
          url: string
          publicId: string
          _id: string
        }>
        currentPrice: number
        slug: string
      }
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
  // Campos legacy (deprecated, usar productId directamente)
  productTitle?: string
  productImage?: string
  productDescription?: string
}

export interface Cart {
  _id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  discountTotal: number
  grandTotal: number
  status: "open" | "converted" | "abandoned"
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCartItemDto {
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
}

export interface CreateCartDto {
  sessionId?: string
  items?: CreateCartItemDto[]
}

export interface UpdateCartDto {
  items?: CreateCartItemDto[]
  status?: "open" | "converted" | "abandoned"
}
