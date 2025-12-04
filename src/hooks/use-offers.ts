import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"
import { offersService } from "@/services/offers-service"
import type { CreateOfferDto, UpdateOfferDto } from "@/types/offer"

const OFFERS_KEY = "offers-list"

// Fetcher for SWR
const fetchOffers = async ([, page, limit]: [string, number, number]) => {
  return offersService.getOffers(page, limit)
}

// Hook for fetching offers with pagination
export function useOffers(page = 1, limit = 10) {
  return useSWR([OFFERS_KEY, page, limit], fetchOffers, {
    revalidateOnFocus: false,
  })
}

// Hook for fetching a single offer
export function useOffer(id: string | null) {
  return useSWR(
    id ? ["offer", id] : null,
    async ([, offerId]: [string, string]) => offersService.getOfferById(offerId),
    { revalidateOnFocus: false },
  )
}

// Hook for fetching offer by code
export function useOfferByCode(code: string | null) {
  return useSWR(
    code ? ["offer-code", code] : null,
    async ([, offerCode]: [string, string]) => offersService.getOfferByCode(offerCode),
    { revalidateOnFocus: false },
  )
}

export function revalidateOffers() {
  // Revalidate all keys that start with OFFERS_KEY
  mutate((key) => Array.isArray(key) && key[0] === OFFERS_KEY, undefined, { revalidate: true })
}

// Hook for creating an offer
export function useCreateOffer() {
  return useSWRMutation("createOffer", async (_, { arg }: { arg: CreateOfferDto }) => {
    const result = await offersService.createOffer(arg)
    revalidateOffers()
    return result
  })
}

// Hook for updating an offer
export function useUpdateOffer() {
  return useSWRMutation("updateOffer", async (_, { arg }: { arg: { id: string; data: UpdateOfferDto } }) => {
    const result = await offersService.updateOffer(arg.id, arg.data)
    revalidateOffers()
    return result
  })
}

// Hook for deleting an offer
export function useDeleteOffer() {
  return useSWRMutation("deleteOffer", async (_, { arg }: { arg: string }) => {
    const result = await offersService.deleteOffer(arg)
    revalidateOffers()
    return result
  })
}
