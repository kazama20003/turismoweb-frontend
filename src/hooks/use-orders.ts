"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ordersService } from "@/services/orders-service"
import type { CreateOrderDto, UpdateOrderDto } from "@/types/order"

const ORDERS_KEY = "orders-list"

// Hook para obtener órdenes paginadas
export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: [ORDERS_KEY, page, limit],
    queryFn: () => ordersService.getOrders(page, limit),
  })
}

// Hook para obtener una orden por ID
export function useOrder(id: string | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(id!),
    enabled: !!id,
  })
}

// Hook para obtener una orden por código
export function useOrderByCode(code: string | null) {
  return useQuery({
    queryKey: ["order-code", code],
    queryFn: () => ordersService.getOrderByCode(code!),
    enabled: !!code,
  })
}

// Hook para obtener las órdenes del usuario autenticado
export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersService.getMyOrders(),
  })
}

// CREATE ORDER
export function useCreateOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateOrderDto) => {
      return ordersService.createOrder(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// UPDATE ORDER
export function useUpdateOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderDto }) => {
      return ordersService.updateOrder(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["order"] })
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

// DELETE ORDER
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return ordersService.deleteOrder(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
    },
  })

  return {
    ...mutation,
    trigger: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}
