"use client"

import { useState, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { paymentService } from "@/services/payment-service"
import type { FormTokenResponse, CreatePaymentDto } from "@/types/payment"

export function usePayment() {
  const [formTokenData, setFormTokenData] = useState<FormTokenResponse | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentService.generateFormToken(data),
    onSuccess: (data) => {
      setFormTokenData(data)
    },
  })

  const generateFormToken = useCallback(
    async (paymentData: CreatePaymentDto) => {
      try {
        const data = await mutation.mutateAsync(paymentData)
        return data
      } catch (err) {
        console.error("[v0] Error generating form token:", err)
        throw err
      }
    },
    [mutation],
  )

  const resetPayment = useCallback(() => {
    setFormTokenData(null)
    mutation.reset()
  }, [mutation])

  return {
    formTokenData,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    generateFormToken,
    resetPayment,
  }
}
