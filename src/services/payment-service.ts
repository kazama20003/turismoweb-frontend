import { api } from "@/lib/api"
import type { FormTokenResponse, CreatePaymentDto, PaymentResult } from "@/types/payment"

export const paymentService = {
  // POST /payments/form-token → Genera un FormToken de pago (frontend)
  generateFormToken: async (data: CreatePaymentDto): Promise<FormTokenResponse> => {
    const response = await api.post<FormTokenResponse>("/payments/form-token", data)
    return response.data
  },

  // POST /payments/ipn → Webhook IPN de Izipay (uso interno, no se consume desde el frontend)
  // Este endpoint es llamado por Izipay, no necesita método aquí

  // Método auxiliar para verificar el estado de un pago
  getPaymentStatus: async (orderId: string): Promise<PaymentResult> => {
    const response = await api.get<PaymentResult>(`/payments/status/${orderId}`)
    return response.data
  },
}
