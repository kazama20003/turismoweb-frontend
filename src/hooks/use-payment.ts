"use client"

import { useState, useCallback } from "react"
import { paymentService } from "@/services/payment-service"
import type { FormTokenResponse, CreatePaymentDto } from "@/types/payment"

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formTokenData, setFormTokenData] = useState<FormTokenResponse | null>(null)

  const generateFormToken = useCallback(async (paymentData: CreatePaymentDto) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await paymentService.generateFormToken(paymentData)
      setFormTokenData(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error generating payment form"
      setError(errorMessage)
      console.error("[v0] Error generating form token:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPayment = useCallback(() => {
    setFormTokenData(null)
    setError(null)
  }, [])

  return {
    formTokenData,
    isLoading,
    error,
    generateFormToken,
    resetPayment,
  }
}
