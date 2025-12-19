import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vehiclesService } from "@/services/vehicles-service"
import type { CreateVehicleDto, UpdateVehicleDto } from "@/types/vehicle"

const VEHICLES_KEY = "vehicles-list"

// Hook for fetching vehicles with pagination
export function useVehicles(page = 1, limit = 10) {
  const query = useQuery({
    queryKey: [VEHICLES_KEY, page, limit],
    queryFn: () => vehiclesService.getVehicles(page, limit),
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

// Hook for fetching a single vehicle
export function useVehicle(id: string | null) {
  const query = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehiclesService.getVehicleById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

// Hook for creating a vehicle
export function useCreateVehicle() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === VEHICLES_KEY,
      })
    },
  })

  return {
    trigger: mutation.mutate,
    data: mutation.data,
    error: mutation.error,
    isMutating: mutation.isPending,
  }
}

// Hook for updating a vehicle
export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) => vehiclesService.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === VEHICLES_KEY,
      })
    },
  })

  return {
    trigger: mutation.mutate,
    data: mutation.data,
    error: mutation.error,
    isMutating: mutation.isPending,
  }
}

// Hook for deleting a vehicle
export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => vehiclesService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === VEHICLES_KEY,
      })
    },
  })

  return {
    trigger: mutation.mutate,
    data: mutation.data,
    error: mutation.error,
    isMutating: mutation.isPending,
  }
}
