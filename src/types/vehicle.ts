export interface VehicleImage {
  url: string
  publicId: string
}

export interface Vehicle {
  _id: string
  name: string
  brand: string
  model: string
  plate: string
  capacity: number
  isActive: boolean
  images: VehicleImage[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateVehicleDto {
  name: string
  brand: string
  model: string
  plate: string
  capacity: number
  isActive: boolean
  images: VehicleImage[]
}
export type UpdateVehicleDto = Partial<CreateVehicleDto>;

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UploadResponse {
  url: string
  secure_url: string
  public_id: string
  asset_id?: string
  version?: number
  format?: string
  width?: number
  height?: number
  bytes?: number
  original_filename?: string
}
