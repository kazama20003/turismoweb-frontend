import useSWRMutation from "swr/mutation"
import { uploadsService } from "@/services/uploads-service"

// Hook for uploading an image
export function useUploadImage() {
  return useSWRMutation("uploadImage", async (_, { arg }: { arg: File }) => {
    return uploadsService.uploadImage(arg)
  })
}

// Hook for deleting an image
export function useDeleteImage() {
  return useSWRMutation("deleteImage", async (_, { arg }: { arg: string }) => {
    return uploadsService.deleteImage(arg)
  })
}
