"use client"

import { useState } from "react"
import type { CreateOrderItem, Tour, Transport } from "@/types/order"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"

// Declare toursList and transportsList here or import them from appropriate files
const toursList: Tour[] = []
const transportsList: Transport[] = []

const NewBookingPage = () => {
  const [newItem, setNewItem] = useState<Partial<CreateOrderItem>>({
    productType: "Tour",
    adults: 1,
    children: 0,
    infants: 0,
  })

  return (
    <div>
      <Tabs defaultValue="Tour">
        <TabsContent value="Tour" className="space-y-4">
          <Select
            value={typeof newItem.productId === "string" ? newItem.productId : ""}
            onValueChange={(value) => {
              const tour = toursList.find((t: Tour) => t._id === value)
              setNewItem({
                ...newItem,
                productId: value,
                productType: "Tour",
                unitPrice: tour?.currentPrice || 0,
              })
            }}
          >
            {/* Render tour options here */}
          </Select>
        </TabsContent>

        <TabsContent value="Transport" className="space-y-4">
          <Select
            value={typeof newItem.productId === "string" ? newItem.productId : ""}
            onValueChange={(value) => {
              const transport = transportsList.find((t: Transport) => t._id === value)
              setNewItem({
                ...newItem,
                productId: value,
                productType: "Transport",
                unitPrice: transport?.currentPrice || 0,
              })
            }}
          >
            {/* Render transport options here */}
          </Select>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NewBookingPage
