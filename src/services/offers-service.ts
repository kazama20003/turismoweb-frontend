import { api } from "@/lib/api"
import type { Offer, CreateOfferDto, UpdateOfferDto, PaginatedResponse, OfferValidationResult } from "@/types/offer"

export const offersService = {
  // GET /offers?page=X&limit=Y
  async getOffers(page = 1, limit = 10) {
    const response = await api.get<PaginatedResponse<Offer>>("/offers", {
      params: { page, limit },
    })
    return response.data
  },

  // GET /offers/:id
  async getOfferById(id: string) {
    const response = await api.get<Offer>(`/offers/${id}`)
    return response.data
  },

  // POST /offers
  async createOffer(data: CreateOfferDto) {
    const response = await api.post<Offer>("/offers", data)
    return response.data
  },

  // PATCH /offers/:id
  async updateOffer(id: string, data: UpdateOfferDto) {
    const response = await api.patch<Offer>(`/offers/${id}`, data)
    return response.data
  },

  // DELETE /offers/:id
  async deleteOffer(id: string) {
    const response = await api.delete<{ message: string }>(`/offers/${id}`)
    return response.data
  },

  // GET /offers/code/:code
  async getOfferByCode(code: string) {
    const response = await api.get<Offer>(`/offers/code/${code}`)
    return response.data
  },

  // POST /offers/:id/validate
  async validateOffer(id: string, tourId?: string, transportId?: string) {
    const response = await api.post<OfferValidationResult>(`/offers/${id}/validate`, {
      ...(tourId && { tourId }),
      ...(transportId && { transportId }),
    })
    return response.data
  },
}
