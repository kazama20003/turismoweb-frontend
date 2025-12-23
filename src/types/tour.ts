import type { Vehicle } from "./vehicle"

export const DifficultyValues = ["easy", "medium", "hard"] as const
export type Difficulty = (typeof DifficultyValues)[number]

export const AvailabilityTypeValues = ["unlimited", "fixed_dates", "date_range"] as const
export type AvailabilityType = (typeof AvailabilityTypeValues)[number]

export interface TourImage {
  url: string
  publicId: string
  _id?: string
}

export interface TourMeals {
  breakfast: boolean
  lunch: boolean
  dinner: boolean
}

export interface TourItineraryItem {
  order: number
  title: string
  description: string
  durationHours?: number
  images?: string[]
  activities?: string[]
  meals?: TourMeals
  hotelNight?: boolean
  _id?: string
}

export interface TourTranslation {
  lang: string
  title?: string
  description?: string
  slug?: string
  meetingPoint?: string
  metaDescription?: string
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  itinerary?: {
    order: number
    title?: string
    description?: string
  }[]
  _id?: string
}

export interface TourDiscount {
  people: number
  discount: number
}

export interface TourCoordinates {
  lat: number
  lng: number
}

export interface Tour {
  _id: string
  // Base content (Spanish)
  title: string
  description: string
  slug: string
  metaDescription?: string

  // Media
  images: TourImage[]
  videoUrl?: string

  // Location
  locationName: string
  coordinates?: TourCoordinates

  // Duration
  durationDays: number
  durationHours?: number

  // Difficulty & Requirements
  difficulty: Difficulty
  minAge?: number
  capacity?: number

  // Meeting Info
  meetingPoint?: string
  startTime?: string
  endTime?: string

  // Benefits & Preparations (Spanish base)
  benefits?: string[]
  preparations?: string[]

  // Itinerary (Spanish base)
  itinerary: TourItineraryItem[]

  // Translations
  translations: TourTranslation[]

  // Transport
  hasTransport: boolean
  vehicleIds?: (string | Vehicle)[]

  // Guide
  hasGuide: boolean

  // Pricing
  currentPrice: number
  oldPrice?: number
  discounts?: TourDiscount[]

  // Availability & Booking Rules
  availabilityType: AvailabilityType
  startDate?: string
  endDate?: string
  availableDates: string[]
  limitCapacity?: boolean
  minPeoplePerBooking?: number
  maxPeoplePerBooking?: number
  cutoffHoursBeforeStart?: number
  instantConfirmation?: boolean
  isBookable?: boolean

  // Content arrays (Spanish base)
  includes: string[]
  excludes: string[]
  categories: string[]

  // Languages available for this tour
  languages: string[]

  // Ratings
  rating: number
  reviewsCount: number

  // Policies
  cancellationPolicy?: string
  refundPolicy?: string
  changePolicy?: string

  // Status
  isActive: boolean

  // Timestamps
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateTourDto {
  // Required fields
  title: string
  description: string
  locationName: string
  currentPrice: number
  durationDays: number
  slug: string
  

  // Optional fields
  oldPrice?: number
  durationHours?: number
  images?: TourImage[]
  videoUrl?: string
  coordinates?: TourCoordinates

  // Difficulty & Requirements
  difficulty?: Difficulty
  minAge?: number
  capacity?: number

  // Meeting Info
  meetingPoint?: string
  startTime?: string
  endTime?: string

  // Benefits & Preparations
  benefits?: string[]
  preparations?: string[]

  // Itinerary
  itinerary?: TourItineraryItem[]

  // Transport
  hasTransport?: boolean
  vehicleIds?: string[]

  // Guide
  hasGuide?: boolean

  // Pricing
  discounts?: TourDiscount[]

  // Availability & Booking Rules
  availabilityType?: AvailabilityType
  startDate?: string
  endDate?: string
  availableDates?: string[]
  limitCapacity?: boolean
  minPeoplePerBooking?: number
  maxPeoplePerBooking?: number
  cutoffHoursBeforeStart?: number
  instantConfirmation?: boolean
  isBookable?: boolean

  // Content arrays
  includes?: string[]
  excludes?: string[]
  categories?: string[]

  // Languages
  languages?: string[]

  // Ratings (usually set by system, but can be initialized)
  rating?: number
  reviewsCount?: number

  // Policies
  cancellationPolicy?: string
  refundPolicy?: string
  changePolicy?: string

  // Status
  isActive?: boolean

  // Meta
  metaDescription?: string
}

export type UpdateTourDto = Partial<CreateTourDto>

export interface UpdateTourTranslationDto {
  title?: string
  description?: string
  slug?: string
  meetingPoint?: string
  metaDescription?: string
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  itinerary?: {
    order: number
    title?: string
    description?: string
  }[]
}
