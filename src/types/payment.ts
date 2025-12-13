import type { CreateOrderDto } from "./order"

export interface FormTokenResponse {
  formToken: string
  publicKey: string
  orderId: string
}

export interface CreatePaymentDto {
  orderData: CreateOrderDto
}

export interface PaymentResult {
  success: boolean
  orderId: string
  transactionId?: string
  message?: string
}
