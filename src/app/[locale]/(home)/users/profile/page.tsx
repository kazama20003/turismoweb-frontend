"use client"

import type React from "react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  User,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  LogOut,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useProfile, useUpdateProfile, useLogout } from "@/hooks/use-auth"
import { useMyOrders } from "@/hooks/use-orders"
import { useCart } from "@/hooks/use-cart"
import type { OrderStatus, Tour, Transport, OrderItem } from "@/types/order"
import type { CartItem } from "@/types/cart"
import { toast } from "sonner"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { data: userData } = useProfile()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const { cart, removeItem, clearCart, isLoading: cartLoading } = useCart()
  const { trigger: updateProfile, isMutating: isUpdating } = useUpdateProfile()
  const { trigger: logout, isMutating: isLoggingOut } = useLogout()

  const heroRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const ctx = gsap.context(() => {
      if (heroVideoRef.current) {
        gsap.to(heroVideoRef.current, {
          scale: 1.1,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
      }

      if (heroContentRef.current) {
        const children = heroContentRef.current.children
        gsap.from(children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        })
      }
    })

    return () => ctx.revert()
  }, [mounted])

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
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
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

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Failed to logout")
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeItem(productId)
      toast.success("Item removed from cart")
    } catch {
      toast.error("Failed to remove item")
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      toast.success("Cart cleared")
    } catch {
      toast.error("Failed to clear cart")
    }
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
      if ("title" in productId && productId.title) {
        return productId.title
      }
      if ("origin" in productId && "destination" in productId) {
        const origin = productId.origin?.name || "Unknown"
        const destination = productId.destination?.name || "Unknown"
        return `Transport: ${origin} → ${destination}`
      }
      return productId._id || "Unknown Product"
    }
    return "Unknown Product"
  }

  const getProductImage = (productId: string | Tour | Transport): string | undefined => {
    if (typeof productId === "object" && productId && "images" in productId) {
      return productId.images?.[0]?.url
    }
    return undefined
  }

  const getProductSlug = (productId: string | Tour | Transport): string | undefined => {
    if (typeof productId === "object" && productId && "slug" in productId) {
      return productId.slug
    }
    return undefined
  }

  const getProductLink = (item: OrderItem | CartItem): string | null => {
    const slug = getProductSlug(item.productId)
    if (!slug) return null

    if (item.productType === "Tour") {
      return `/tours/${slug}`
    } else if (item.productType === "Transport") {
      return `/transports/${slug}`
    }
    return null
  }

  const extractProductId = (productId: string | { _id: string }): string => {
    if (typeof productId === "string") {
      return productId
    }
    if (productId && typeof productId === "object" && productId._id) {
      return productId._id
    }
    return "Unknown"
  }

  return (
    <div className="min-h-screen bg-background">
      <section ref={heroRef} className="relative h-[40vh] overflow-hidden">
        <div ref={heroVideoRef} className="absolute inset-0">
          <video
            src="https://res.cloudinary.com/ddbzpbrje/video/upload/v1763011237/11929213_1920_1080_60fps_lq178j.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div
          ref={heroContentRef}
          className="absolute inset-0 flex flex-col items-start justify-end text-left px-4 md:px-8 lg:px-12 pb-12"
        >
          <span className="text-white text-xs font-medium tracking-[0.3em] uppercase mb-3 opacity-0">Mi Cuenta</span>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Profile</h1>
          <p className="text-white text-sm md:text-base max-w-md opacity-0">
            Manage your profile, orders, and preferences
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 flex justify-end items-start">
          <div className="flex gap-3">
            <Link href="/">
              <button className="px-4 py-2 bg-background border border-foreground/10 text-foreground text-xs tracking-wider uppercase hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
                <Home className="w-4 h-4 mr-2 inline" />
                Go Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-background border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 text-xs tracking-wider uppercase"
            >
              <LogOut className="w-4 h-4 mr-2 inline" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
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
            <TabsTrigger value="cart" className="text-xs tracking-wider uppercase">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-secondary p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif text-foreground">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-background border border-foreground/10 text-foreground text-xs tracking-wider uppercase hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-background border border-foreground/10 text-foreground text-xs tracking-wider uppercase hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-accent text-accent-foreground text-xs tracking-wider uppercase hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-foreground mb-2">
                    Document Type
                  </label>
                  <input
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-medium text-foreground mb-2">
                    Document Number
                  </label>
                  <input
                    id="documentNumber"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
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
                  <div key={order._id} className="bg-secondary p-6 rounded-none border-2">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-accent font-medium tracking-wider uppercase">
                            {order.confirmationCode || order._id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-1 font-medium uppercase tracking-wider flex items-center gap-1 rounded-none ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item, idx) => {
                            const productTitle = getProductTitle(item.productId)
                            const productImage = getProductImage(item.productId)
                            const productLink = getProductLink(item)
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
                                {productImage && (
                                  <div className="w-24 h-24 shrink-0 bg-muted overflow-hidden rounded-none">
                                    <Image
                                      src={productImage || "/placeholder.svg"}
                                      alt={productTitle}
                                      width={96}
                                      height={96}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  {productLink ? (
                                    <Link href={productLink}>
                                      <h4 className="font-serif text-foreground mb-1 hover:text-accent transition-colors">
                                        {productTitle}
                                      </h4>
                                    </Link>
                                  ) : (
                                    <h4 className="font-serif text-foreground mb-1">{productTitle}</h4>
                                  )}
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
              <div className="bg-secondary p-12 text-center rounded-none border-2">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link
                  href="/tours"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all rounded-none"
                >
                  Browse Tours
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-foreground">My Cart</h3>
              {cart && cart.items && cart.items.length > 0 && (
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="text-xs tracking-wider uppercase bg-transparent rounded-none"
                >
                  Clear Cart
                </Button>
              )}
            </div>

            {cartLoading ? (
              <div className="text-center py-8">
                <p>Loading cart...</p>
              </div>
            ) : cart && cart.items && cart.items.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item, idx) => {
                  const productTitle = getProductTitle(item.productId)
                  const productImage = getProductImage(item.productId)
                  const productLink = getProductLink(item)
                  const productId = extractProductId(item.productId)
                  const detailsText = [
                    item.productType,
                    item.adults && `Adults: ${item.adults}`,
                    item.children && `Children: ${item.children}`,
                    item.infants && `Infants: ${item.infants}`,
                  ]
                    .filter(Boolean)
                    .join(" • ")

                  return (
                    <div key={idx} className="bg-secondary p-6 rounded-none border-2">
                      <div className="flex gap-4">
                        {productImage && (
                          <div className="w-32 h-32 shrink-0 bg-muted overflow-hidden rounded-none">
                            <Image
                              src={productImage || "/placeholder.svg"}
                              alt={productTitle}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {productLink ? (
                            <Link href={productLink}>
                              <h4 className="font-serif text-foreground mb-1 hover:text-accent transition-colors">
                                {productTitle}
                              </h4>
                            </Link>
                          ) : (
                            <h4 className="font-serif text-foreground mb-1">{productTitle}</h4>
                          )}
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
                        <div className="flex flex-col items-end justify-between">
                          <p className="font-serif text-foreground text-lg">${item.totalPrice.toFixed(2)}</p>
                          <Button
                            onClick={() => handleRemoveFromCart(productId)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="bg-secondary p-6 rounded-none border-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    {cart.discountTotal > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-${cart.discountTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-serif pt-2 border-t border-border">
                      <span className="text-foreground">Total:</span>
                      <span className="text-foreground">${cart.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full mt-4 text-xs tracking-wider uppercase rounded-none">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-secondary p-12 text-center rounded-none border-2">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Link
                  href="/tours"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all rounded-none"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
