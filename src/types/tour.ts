export interface CloudinaryImageDto {
  url: string
  secure_url: string
  public_id: string
}

export interface CoordinatesDto {
  latitude: number
  longitude: number
}

export interface ItineraryItem {
  order: number
  title: string
  description: string
  durationHours?: number
  images?: string[]
  activities?: string[]
  meals?: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
  }
  hotelNight?: boolean
}

export interface Discount {
  people: number
  discount: number
}

export type Difficulty = "easy" | "medium" | "hard"
export type AvailabilityType = "unlimited" | "fixed_dates" | "date_range"

export interface Tour {
  _id: string
  title: string
  description: string
  images?: CloudinaryImageDto[]
  videoUrl?: string
  locationName: string
  coordinates?: CoordinatesDto
  durationDays: number
  durationHours?: number
  difficulty?: Difficulty
  minAge?: number
  capacity?: number
  meetingPoint?: string
  startTime?: string
  endTime?: string
  benefits?: string[]
  preparations?: string[]
  itinerary?: ItineraryItem[]
  hasTransport?: boolean
  vehicleIds?: string[]
  hasGuide?: boolean
  currentPrice: number
  oldPrice?: number
  discounts?: Discount[]
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
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  languages?: string[]
  rating?: number
  reviewsCount?: number
  cancellationPolicy?: string
  refundPolicy?: string
  changePolicy?: string
  isActive?: boolean
  slug: string
  metaDescription?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateTourDto = Omit<Tour, "_id" | "createdAt" | "updatedAt">

export type UpdateTourDto = Partial<CreateTourDto>

export interface UpdateTranslationItineraryItemDto {
  order: number
  title?: string
  description?: string
}

export interface UpdateTourTranslationDto {
  title?: string
  description?: string
  slug?: string
  meetingPoint?: string
  metaDescription?: string
  includes?: string[]
  excludes?: string[]
  categories?: string[]
  itinerary?: UpdateTranslationItineraryItemDto[]
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
