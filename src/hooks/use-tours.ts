"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toursService } from "@/services/tours-service"
import type { CreateTourDto, UpdateTourDto, UpdateTourTranslationDto } from "@/types/tour"

const TOURS_KEY = "tours-list"
const POPULAR_TOURS_KEY = "tours-popular"

// Supported languages for translations
export const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "it", name: "Italiano" },
  { code: "de", name: "Alemán" },
  { code: "pt", name: "Portugués" },
  { code: "zh", name: "Chino" },
  { code: "ja", name: "Japonés" },
  { code: "ru", name: "Ruso" },
] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"]

export function isValidLanguageCode(code: string): code is SupportedLanguageCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code)
}

// Hook para obtener tours paginados
export function useTours(page = 1, limit = 10, lang?: string) {
  return useQuery({
    queryKey: [TOURS_KEY, page, limit, lang],
    queryFn: () => toursService.getTours(page, limit, lang),
  })
}

// Hook para obtener un tour por slug
export function useTourBySlug(slug: string | null, lang?: string) {
  return useQuery({
    queryKey: ["tour-slug", slug, lang],
    queryFn: () => toursService.getTourBySlug(slug!, lang),
    enabled: !!slug,
  })
}

// Hook para obtener un tour por ID
export function useTour(id: string | null, lang?: string) {
  return useQuery({
    queryKey: ["tour", id, lang],
    queryFn: () => toursService.getTourById(id!, lang),
    enabled: !!id,
  })
}

// Hook para obtener tours populares
export function usePopularTours(lang?: string) {
  return useQuery({
    queryKey: [POPULAR_TOURS_KEY, lang],
    queryFn: () => toursService.getPopularTours(lang),
  })
}

export function useCreateTour() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateTourDto) => {
      return toursService.createTour(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOURS_KEY] })
      queryClient.invalidateQueries({ queryKey: [POPULAR_TOURS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useUpdateTour() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTourDto }) => {
      return toursService.updateTour(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOURS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["tour"] })
      queryClient.invalidateQueries({ queryKey: [POPULAR_TOURS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useDeleteTour() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return toursService.deleteTour(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOURS_KEY] })
      queryClient.invalidateQueries({ queryKey: [POPULAR_TOURS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useAutoTranslateTour() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, languages }: { id: string; languages: SupportedLanguageCode[] }) => {
      const validLanguages = languages.filter(isValidLanguageCode)
      if (!validLanguages.length) throw new Error("No valid languages provided")
      return toursService.autoTranslateTour(id, validLanguages)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOURS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["tour"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

export function useUpdateTourTranslation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      id,
      lang,
      data,
    }: { id: string; lang: SupportedLanguageCode; data: UpdateTourTranslationDto }) => {
      return toursService.updateTourTranslation(id, lang, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOURS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["tour"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}
