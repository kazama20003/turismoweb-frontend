// Idiomas soportados en el sistema
export const SUPPORTED_LANGS = [
  "es", // Español
  "en", // Inglés
  "fr", // Francés
  "it", // Italiano
  "de", // Alemán
  "pt", // Portugués
  "zh", // Chino
  "ja", // Japonés
  "ru", // Ruso
] as const

export type Lang = (typeof SUPPORTED_LANGS)[number]

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface Coordinates {
  name: string
  lat: number
  lng: number
}

export interface RouteImage {
  url?: string
  publicId?: string
}

export interface RouteStep {
  order: number
  name: string
  lat: number
  lng: number
  image?: RouteImage
  translations?: Partial<Record<Lang, string>>
}

export interface TransportImage {
  url: string
  publicId: string
}

export interface Transport {
  _id: string
  title: string
  titleTranslations?: Partial<Record<Lang, string>>
  description?: string
  descriptionTranslations?: Partial<Record<Lang, string>>
  routeDescription?: string
  routeDescriptionTranslations?: Partial<Record<Lang, string>>
  route?: RouteStep[]
  origin: Coordinates
  destination: Coordinates
  vehicle:
    | string
    | {
        _id: string
        name: string
        brand: string
        model: string
        capacity: number
      }
  currentPrice: number
  oldPrice?: number
  durationHours?: number
  durationMinutes?: number
  departureTime?: string
  arrivalTime?: string
  availableDays?: WeekDay[]
  images?: TransportImage[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  slug?: string
}

export interface CreateTransportDto {
  title: string
  titleTranslations?: Partial<Record<Lang, string>>
  description?: string
  descriptionTranslations?: Partial<Record<Lang, string>>
  routeDescription?: string
  routeDescriptionTranslations?: Partial<Record<Lang, string>>
  route?: RouteStep[]
  origin: Coordinates
  destination: Coordinates
  vehicle: string
  currentPrice: number
  oldPrice?: number
  durationHours?: number
  durationMinutes?: number
  departureTime?: string
  arrivalTime?: string
  availableDays?: WeekDay[]
  images?: TransportImage[]
}

export type UpdateTransportDto = Partial<CreateTransportDto>

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
