import { api } from "@/lib/api"
import type { UploadResponse } from "@/types/vehicle"

export const uploadsService = {
  // POST /uploads/image
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post<UploadResponse>("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return {
      url: response.data.secure_url || response.data.url,
      publicId: response.data.public_id,
    }
  },

  // DELETE /uploads/:publicId
  async deleteImage(publicId: string) {
    const encodedPublicId = encodeURIComponent(publicId)
    console.log("[v0] Deleting image with publicId:", publicId, "encoded:", encodedPublicId)
    const response = await api.delete<{ result: string }>(`/uploads/${encodedPublicId}`)
    return response.data
  },
}
