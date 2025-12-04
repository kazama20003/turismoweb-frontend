import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"
import { transportsService } from "@/services/transports-service"
import type { CreateTransportDto, UpdateTransportDto } from "@/types/transport"

const TRANSPORTS_KEY = "transports-list"

// Fetcher for SWR
const fetchTransports = async ([, page, limit]: [string, number, number]) => {
  return transportsService.getTransports(page, limit)
}

// Hook for fetching transports with pagination
export function useTransports(page = 1, limit = 10) {
  return useSWR([TRANSPORTS_KEY, page, limit], fetchTransports, {
    revalidateOnFocus: false,
  })
}

// Hook for fetching a single transport
export function useTransport(id: string | null) {
  return useSWR(
    id ? ["transport", id] : null,
    async ([, transportId]: [string, string]) => transportsService.getTransportById(transportId),
    { revalidateOnFocus: false },
  )
}

export function revalidateTransports() {
  mutate((key) => Array.isArray(key) && key[0] === TRANSPORTS_KEY, undefined, { revalidate: true })
}

// Hook for creating a transport
export function useCreateTransport() {
  return useSWRMutation("createTransport", async (_, { arg }: { arg: CreateTransportDto }) => {
    const result = await transportsService.createTransport(arg)
    revalidateTransports()
    return result
  })
}

// Hook for updating a transport
export function useUpdateTransport() {
  return useSWRMutation("updateTransport", async (_, { arg }: { arg: { id: string; data: UpdateTransportDto } }) => {
    const result = await transportsService.updateTransport(arg.id, arg.data)
    revalidateTransports()
    return result
  })
}

// Hook for deleting a transport
export function useDeleteTransport() {
  return useSWRMutation("deleteTransport", async (_, { arg }: { arg: string }) => {
    const result = await transportsService.deleteTransport(arg)
    revalidateTransports()
    return result
  })
}
