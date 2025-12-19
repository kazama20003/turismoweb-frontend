"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { transportsService } from "@/services/transports-service"
import type { CreateTransportDto, UpdateTransportDto } from "@/types/transport"

const TRANSPORTS_KEY = "transports-list"

// Hook para obtener transportes paginados
export function useTransports(page = 1, limit = 10, lang = "es") {
  const query = useQuery({
    queryKey: [TRANSPORTS_KEY, page, limit, lang],
    queryFn: () => transportsService.getTransports(page, limit, lang),
  })

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

// Hook para obtener un transporte por ID
export function useTransport(id: string | null) {
  const query = useQuery({
    queryKey: ["transport", id],
    queryFn: () => transportsService.getTransportById(id!),
    enabled: !!id,
  })

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

// Hook para obtener un transporte por slug
export function useTransportBySlug(slug: string | null, lang = "es") {
  const query = useQuery({
    queryKey: ["transport-slug", slug, lang],
    queryFn: () => transportsService.getTransportBySlug(slug!, lang),
    enabled: !!slug,
  })

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    mutate: query.refetch,
  }
}

// CREATE TRANSPORT
export function useCreateTransport() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateTransportDto) => {
      return transportsService.createTransport(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

// UPDATE TRANSPORT
export function useUpdateTransport() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransportDto }) => {
      return transportsService.updateTransport(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["transport"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

// DELETE TRANSPORT
export function useDeleteTransport() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return transportsService.deleteTransport(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
