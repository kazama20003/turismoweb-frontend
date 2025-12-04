import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"
import { vehiclesService } from "@/services/vehicles-service"
import type { CreateVehicleDto, UpdateVehicleDto } from "@/types/vehicle"

const VEHICLES_KEY = "vehicles-list"

// Fetcher for SWR
const fetchVehicles = async ([, page, limit]: [string, number, number]) => {
  return vehiclesService.getVehicles(page, limit)
}

// Hook for fetching vehicles with pagination
export function useVehicles(page = 1, limit = 10) {
  return useSWR([VEHICLES_KEY, page, limit], fetchVehicles, {
    revalidateOnFocus: false,
  })
}

// Hook for fetching a single vehicle
export function useVehicle(id: string | null) {
  return useSWR(
    id ? ["vehicle", id] : null,
    async ([, vehicleId]: [string, string]) => vehiclesService.getVehicleById(vehicleId),
    { revalidateOnFocus: false },
  )
}

export function revalidateVehicles() {
  // Revalidate all keys that start with VEHICLES_KEY
  mutate((key) => Array.isArray(key) && key[0] === VEHICLES_KEY, undefined, { revalidate: true })
}

// Hook for creating a vehicle
export function useCreateVehicle() {
  return useSWRMutation("createVehicle", async (_, { arg }: { arg: CreateVehicleDto }) => {
    const result = await vehiclesService.createVehicle(arg)
    revalidateVehicles()
    return result
  })
}

// Hook for updating a vehicle
export function useUpdateVehicle() {
  return useSWRMutation("updateVehicle", async (_, { arg }: { arg: { id: string; data: UpdateVehicleDto } }) => {
    const result = await vehiclesService.updateVehicle(arg.id, arg.data)
    revalidateVehicles()
    return result
  })
}

// Hook for deleting a vehicle
export function useDeleteVehicle() {
  return useSWRMutation("deleteVehicle", async (_, { arg }: { arg: string }) => {
    const result = await vehiclesService.deleteVehicle(arg)
    revalidateVehicles()
    return result
  })
}
