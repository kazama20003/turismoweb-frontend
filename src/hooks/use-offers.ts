"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { offersService } from "@/services/offers-service"
import type { CreateOfferDto, UpdateOfferDto } from "@/types/offer"

const OFFERS_KEY = "offers-list"

// Hook para obtener ofertas paginadas
export function useOffers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [OFFERS_KEY, page, limit],
    queryFn: () => offersService.getOffers(page, limit),
  })
}

// Hook para obtener una oferta por ID
export function useOffer(id: string | null) {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => offersService.getOfferById(id!),
    enabled: !!id,
  })
}

// Hook para obtener una oferta por código
export function useOfferByCode(code: string | null) {
  return useQuery({
    queryKey: ["offer-code", code],
    queryFn: () => offersService.getOfferByCode(code!),
    enabled: !!code,
  })
}

// CREATE OFFER
export function useCreateOffer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateOfferDto) => {
      return offersService.createOffer(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// UPDATE OFFER
export function useUpdateOffer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOfferDto }) => {
      return offersService.updateOffer(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["offer"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// DELETE OFFER
export function useDeleteOffer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return offersService.deleteOffer(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}
