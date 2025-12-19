"use client"

import { useEffect, useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cartService } from "@/services/cart-service"
import type { Cart, CreateCartItemDto, CartItem } from "@/types/cart"
import { v4 as uuidv4 } from "uuid"

const CART_SESSION_KEY = "cart_session_id"
const CART_KEY = "cart"

// Genera o recupera el sessionId
const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return ""

  let sessionId = localStorage.getItem(CART_SESSION_KEY)
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem(CART_SESSION_KEY, sessionId)
  }
  return sessionId
}

// Elimina el sessionId del localStorage
const clearSessionId = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_SESSION_KEY)
  }
}

const extractProductId = (productId: CartItem["productId"]): string => {
  if (typeof productId === "string") {
    return productId
  }
  return productId._id
}

const sanitizeCartItem = (item: CartItem): CreateCartItemDto => {
  const sanitized: CreateCartItemDto = {
    productId: extractProductId(item.productId),
    productType: item.productType,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }

  // Solo incluir campos opcionales si existen
  if (item.travelDate) sanitized.travelDate = item.travelDate
  if (item.adults !== undefined) sanitized.adults = item.adults
  if (item.children !== undefined) sanitized.children = item.children
  if (item.infants !== undefined) sanitized.infants = item.infants
  if (item.appliedOfferId) sanitized.appliedOfferId = item.appliedOfferId
  if (item.notes) sanitized.notes = item.notes

  return sanitized
}

export function useCart() {
  const [sessionId, setSessionId] = useState<string>("")
  const queryClient = useQueryClient()

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  // Query para obtener el carrito actual
  const {
    data: cart,
    error,
    isLoading,
  } = useQuery<Cart | null>({
    queryKey: [CART_KEY, sessionId],
    queryFn: () => cartService.getCurrentCart(sessionId),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // Mutation para agregar item
  const addItemMutation = useMutation({
    mutationFn: async (item: CreateCartItemDto) => {
      console.log("[v0] Adding item to cart:", item)

      if (!cart) {
        // Crear nuevo carrito con el item
        return cartService.createCart({
          sessionId,
          items: [item],
        })
      } else {
        const existingItems = cart.items.map(sanitizeCartItem)
        const updatedItems = [...existingItems, item]

        console.log("[v0] Updating cart with sanitized items:", updatedItems)

        return cartService.updateCart(cart._id, {
          items: updatedItems,
        })
      }
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData([CART_KEY, sessionId], updatedCart)
    },
  })

  // Mutation para remover item
  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!cart) throw new Error("No cart found")

      const updatedItems = cart.items
        .filter((item) => extractProductId(item.productId) !== productId)
        .map(sanitizeCartItem)

      // Si no quedan items, eliminar el carrito
      if (updatedItems.length === 0) {
        await cartService.deleteCart(cart._id)
        clearSessionId()
        setSessionId(getOrCreateSessionId())
        return null
      } else {
        return cartService.updateCart(cart._id, {
          items: updatedItems,
        })
      }
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData([CART_KEY, sessionId], updatedCart)
    },
  })

  // Mutation para actualizar item
  const updateItemMutation = useMutation({
    mutationFn: async ({ productId, updates }: { productId: string; updates: Partial<CreateCartItemDto> }) => {
      if (!cart) throw new Error("No cart found")

      const updatedItems = cart.items
        .map((item) => (extractProductId(item.productId) === productId ? { ...item, ...updates } : item))
        .map(sanitizeCartItem)

      return cartService.updateCart(cart._id, {
        items: updatedItems,
      })
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData([CART_KEY, sessionId], updatedCart)
    },
  })

  // Mutation para limpiar carrito
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!cart) throw new Error("No cart found")

      await cartService.deleteCart(cart._id)
      clearSessionId()
      setSessionId(getOrCreateSessionId())
      return null
    },
    onSuccess: () => {
      queryClient.setQueryData([CART_KEY, sessionId], null)
    },
  })

  // Funciones helper
  const addItem = useCallback(
    async (item: CreateCartItemDto) => {
      try {
        return await addItemMutation.mutateAsync(item)
      } catch (error) {
        console.error("[v0] Error adding item to cart:", error)
        throw error
      }
    },
    [addItemMutation],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        await removeItemMutation.mutateAsync(productId)
      } catch (error) {
        console.error("[v0] Error removing item from cart:", error)
        throw error
      }
    },
    [removeItemMutation],
  )

  const updateItem = useCallback(
    async (productId: string, updates: Partial<CreateCartItemDto>) => {
      try {
        return await updateItemMutation.mutateAsync({ productId, updates })
      } catch (error) {
        console.error("[v0] Error updating item in cart:", error)
        throw error
      }
    },
    [updateItemMutation],
  )

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync()
    } catch (error) {
      console.error("[v0] Error clearing cart:", error)
      throw error
    }
  }, [clearCartMutation])

  return {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    itemCount: cart?.items?.length ?? 0,
    totalPrice: cart?.totalPrice ?? 0,
  }
}
