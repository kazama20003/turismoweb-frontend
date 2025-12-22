"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useProfile, useUpdateProfile } from "@/hooks/use-auth"
import { useMyOrders } from "@/hooks/use-orders"
import { useCart } from "@/hooks/use-cart"
import type { OrderStatus, Tour, Transport } from "@/types/order"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { data: userData } = useProfile()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const { isLoading: _cartLoading } = useCart()
  const { trigger: updateProfile, isMutating: isUpdating } = useUpdateProfile()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    country: userData?.country || "",
    address: userData?.address || "",
    documentType: userData?.documentType || "",
    documentNumber: userData?.documentNumber || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSaveProfile = async () => {
    if (!userData?._id) return

    try {
      await updateProfile({
        id: userData._id,
        data: formData,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      country: userData?.country || "",
      address: userData?.address || "",
      documentType: userData?.documentType || "",
      documentNumber: userData?.documentNumber || "",
    })
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "canceled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "canceled":
        return <XCircle className="w-3 h-3" />
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const getProductTitle = (productId: string | Tour | Transport): string => {
    if (typeof productId === "string") {
      return productId
    }
    if (productId && typeof productId === "object") {
      // Handle Tour type (has title property)
      if ("title" in productId && productId.title) {
        return productId.title
      }
      // Handle Transport type (no title, create descriptive string)
      if ("origin" in productId && "destination" in productId) {
        const origin = productId.origin?.name || "Unknown"
        const destination = productId.destination?.name || "Unknown"
        return `Transport: ${origin} → ${destination}`
      }
      return productId._id || "Unknown Product"
    }
    return "Unknown Product"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="profile" className="text-xs tracking-wider uppercase">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs tracking-wider uppercase">
              <ShoppingBag className="w-4 h-4 mr-2" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="text-xs tracking-wider uppercase">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif text-foreground">Personal Information</h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="text-xs tracking-wider uppercase"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="text-xs tracking-wider uppercase bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isUpdating}
                        className="text-xs tracking-wider uppercase"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Input
                      id="documentType"
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number</Label>
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h3 className="text-2xl font-serif text-foreground mb-6">My Orders</h3>

            {ordersLoading ? (
              <div className="text-center py-8">
                <p>Loading orders...</p>
              </div>
            ) : Array.isArray(ordersData) && ordersData.length > 0 ? (
              <div className="space-y-4">
                {ordersData.map((order) => (
                  <div key={order._id} className="bg-secondary p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-accent font-medium tracking-wider uppercase">
                            {order.confirmationCode || order._id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider flex items-center gap-1 ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item, idx) => {
                            const productTitle = getProductTitle(item.productId)
                            const detailsText = [
                              item.productType,
                              item.adults && `Adults: ${item.adults}`,
                              item.children && `Children: ${item.children}`,
                              item.infants && `Infants: ${item.infants}`,
                            ]
                              .filter(Boolean)
                              .join(" • ")

                            return (
                              <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0">
                                <div className="flex-1">
                                  <h4 className="font-serif text-foreground mb-1">{productTitle}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{detailsText}</p>
                                  {item.travelDate && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Calendar className="w-3 h-3" />
                                      <span>{new Date(item.travelDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {item.notes && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{item.notes}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-serif text-foreground">${item.totalPrice.toFixed(2)}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-serif">
                            <span className="text-foreground">Total:</span>
                            <span className="text-foreground">${order.grandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link
                  href="/tours"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
                >
                  Browse Tours
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <h3 className="text-2xl font-serif text-foreground mb-6">My Wishlist</h3>
            <div className="bg-secondary p-12 text-center rounded-lg">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link
                href="/tours"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
              >
                Discover Tours
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
