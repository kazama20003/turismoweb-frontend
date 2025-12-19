"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadsService } from "@/services/uploads-service"

// Hook for uploading an image
export function useUploadImage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      return uploadsService.uploadImage(file)
    },
    onSuccess: () => {
      // Optionally invalidate any queries that depend on uploaded images
      queryClient.invalidateQueries({ queryKey: ["images"] })
    },
  })

  return {
    trigger: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isMutating: mutation.isPending,
    // Native TanStack Query properties
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

// Hook for deleting an image
export function useDeleteImage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (imageId: string) => {
      return uploadsService.deleteImage(imageId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] })
    },
  })

  return {
    trigger: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isMutating: mutation.isPending,
    // Native TanStack Query properties
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
