import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { vehiclesService } from "@/services/vehicles-service"
import type { CreateVehicleDto, UpdateVehicleDto } from "@/types/vehicle"

// Fetcher for SWR
const fetchVehicles = async ([, page, limit]: [string, number, number]) => {
  return vehiclesService.getVehicles(page, limit)
}

// Hook for fetching vehicles with pagination
export function useVehicles(page = 1, limit = 10) {
  return useSWR(["vehicles", page, limit], fetchVehicles, {
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

// Hook for creating a vehicle
export function useCreateVehicle() {
  const { mutate } = useSWR(["vehicles", 1, 10])

  return useSWRMutation(
    "createVehicle",
    async (_, { arg }: { arg: CreateVehicleDto }) => {
      return vehiclesService.createVehicle(arg)
    },
    {
      onSuccess: () => {
        mutate()
      },
    },
  )
}

// Hook for updating a vehicle
export function useUpdateVehicle() {
  const { mutate } = useSWR(["vehicles", 1, 10])

  return useSWRMutation(
    "updateVehicle",
    async (_, { arg }: { arg: { id: string; data: UpdateVehicleDto } }) => {
      return vehiclesService.updateVehicle(arg.id, arg.data)
    },
    {
      onSuccess: () => {
        mutate()
      },
    },
  )
}

// Hook for deleting a vehicle
export function useDeleteVehicle() {
  const { mutate } = useSWR(["vehicles", 1, 10])

  return useSWRMutation(
    "deleteVehicle",
    async (_, { arg }: { arg: string }) => {
      return vehiclesService.deleteVehicle(arg)
    },
    {
      onSuccess: () => {
        mutate()
      },
    },
  )
}
