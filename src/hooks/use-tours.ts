import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"
import { toursService } from "@/services/tours-service"
import type { CreateTourDto, UpdateTourDto, UpdateTourTranslationDto } from "@/types/tour"

const TOURS_KEY = "tours-list"

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

// Fetcher for SWR
const fetchTours = async ([, page, limit, lang]: [string, number, number, string | undefined]) => {
  return toursService.getTours(page, limit, lang)
}

// Hook for fetching tours with pagination
export function useTours(page = 1, limit = 10, lang?: string) {
  return useSWR([TOURS_KEY, page, limit, lang], fetchTours, {
    revalidateOnFocus: false,
  })
}

// Hook for fetching a single tour
export function useTour(id: string | null, lang?: string) {
  return useSWR(
    id ? ["tour", id, lang] : null,
    async ([, tourId]: [string, string]) => toursService.getTourById(tourId, lang),
    { revalidateOnFocus: false },
  )
}

export function revalidateTours() {
  // Revalidate all keys that start with TOURS_KEY
  mutate((key) => Array.isArray(key) && key[0] === TOURS_KEY, undefined, { revalidate: true })
}

// Hook for creating a tour
export function useCreateTour() {
  return useSWRMutation("createTour", async (_, { arg }: { arg: CreateTourDto }) => {
    const result = await toursService.createTour(arg)
    revalidateTours()
    return result
  })
}

// Hook for updating a tour
export function useUpdateTour() {
  return useSWRMutation("updateTour", async (_, { arg }: { arg: { id: string; data: UpdateTourDto } }) => {
    const result = await toursService.updateTour(arg.id, arg.data)
    revalidateTours()
    return result
  })
}

// Hook for deleting a tour
export function useDeleteTour() {
  return useSWRMutation("deleteTour", async (_, { arg }: { arg: string }) => {
    const result = await toursService.deleteTour(arg)
    revalidateTours()
    return result
  })
}

// Hook for auto-translating a tour
export function useAutoTranslateTour() {
  return useSWRMutation(
    "autoTranslateTour",
    async (_, { arg }: { arg: { id: string; languages: SupportedLanguageCode[] } }) => {
      // Validate all languages before sending
      const validLanguages = arg.languages.filter(isValidLanguageCode)
      if (validLanguages.length === 0) {
        throw new Error("No valid languages provided")
      }
      const result = await toursService.autoTranslateTour(arg.id, validLanguages)
      revalidateTours()
      return result
    },
  )
}

// Hook for updating a tour translation
export function useUpdateTourTranslation() {
  return useSWRMutation(
    "updateTourTranslation",
    async (_, { arg }: { arg: { id: string; lang: SupportedLanguageCode; data: UpdateTourTranslationDto } }) => {
      const result = await toursService.updateTourTranslation(arg.id, arg.lang, arg.data)
      revalidateTours()
      return result
    },
  )
}
