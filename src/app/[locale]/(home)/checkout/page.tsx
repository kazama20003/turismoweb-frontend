"use client"

import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useCart } from "@/hooks/use-cart"
import { useProfile } from "@/hooks/use-auth"
import { usePayment } from "@/hooks/use-payment"
import type { CreateOrderDto, CreateOrderItem } from "@/types/order"
import type { CartItem, Cart } from "@/types/cart"
import { offersService } from "@/services/offers-service"
import { ArrowLeft, CreditCard, ShoppingBag, Loader2, CheckCircle2, XCircle, Tag, X, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { OrderStatus, PaymentStatus } from "@/types/order"

declare global {
  interface Window {
    KR?: {
      onSubmit: (callback: (paymentData: unknown) => boolean) => void
      onError: (callback: (error: unknown) => void) => void
    }
  }
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const USD_TO_PEN = 3.63

const getProductTitle = (item: CartItem): string => {
  if (typeof item.productId === "object" && item.productId && "title" in item.productId) {
    return item.productId.title || "Tour"
  }
  return "Tour"
}

const getProductImage = (item: CartItem): string => {
  if (
    typeof item.productId === "object" &&
    item.productId &&
    "images" in item.productId &&
    Array.isArray(item.productId.images) &&
    item.productId.images.length > 0
  ) {
    return item.productId.images[0].url || "/placeholder.svg"
  }
  return "/placeholder.svg"
}

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading } = useCart()
  const { data: user } = useProfile()
  const { formTokenData, isLoading: paymentLoading, error: paymentError, generateFormToken } = usePayment()
  const [paymentStatus, setPaymentStatus] = useState("idle")
  const [mounted, setMounted] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [couponCode, setCouponCode] = useState("")
  const [appliedOffer, setAppliedOffer] = useState<{ id: string; code: string; discount: number } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const subtotal = Number(cart?.grandTotal) || 0
  const discount = appliedOffer ? appliedOffer.discount : 0
  const serviceFee = 0
  const grandTotal = subtotal - discount + serviceFee

  useEffect(() => {
    if (user?.email) {
      setCustomerInfo((prev) => ({
        ...prev,
        email: user.email,
        name: prev.name || user.fullName || "",
      }))
    }
  }, [user])

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
            scrub: true,
          },
        })
      }

      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, {
          opacity: 0,
          y: 100,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "50% top",
            scrub: true,
          },
        })
      }

      const heroElements = heroContentRef.current?.children
      if (heroElements) {
        gsap.fromTo(
          heroElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.3,
            ease: "power3.out",
          },
        )
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" },
        )
      }
    })

    return () => ctx.revert()
  }, [mounted])

  useEffect(() => {
    if (!formTokenData) return

    const script = document.createElement("script")
    script.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
    script.async = true
    script.setAttribute("kr-public-key", formTokenData.publicKey)
    script.setAttribute("kr-language", "es-ES")

    const scriptClassic = document.createElement("script")
    scriptClassic.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js"
    scriptClassic.async = true

    document.body.appendChild(script)
    document.body.appendChild(scriptClassic)

    script.onload = () => {
      if (window.KR) {
        window.KR.onSubmit((paymentData: unknown) => {
          console.log("[v0] Payment submitted:", paymentData)
          setPaymentStatus("success")
          return false
        })

        window.KR.onError((error: unknown) => {
          console.error("[v0] Payment error:", error)
          setPaymentStatus("error")
        })
      }
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
      if (document.body.contains(scriptClassic)) document.body.removeChild(scriptClassic)
    }
  }, [formTokenData])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    setCouponLoading(true)
    try {
      const offer = await offersService.getOfferByCode(couponCode.trim())

      if (!offer || !offer.isActive) {
        toast.error("Invalid or inactive coupon code")
        setCouponLoading(false)
        return
      }

      setAppliedOffer({
        id: offer._id,
        code: offer.code,
        discount: offer.value || 0,
      })
      toast.success(`Coupon applied! You saved $${offer.value?.toFixed(2) || 0}`)
    } catch (error) {
      console.error("[v0] Error applying coupon:", error)
      toast.error("Failed to apply coupon. Please try again.")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedOffer(null)
    setCouponCode("")
    toast.success("Coupon removed")
  }

  const convertCartToOrderData = (cartData: Cart, customerData: typeof customerInfo): CreateOrderDto => {
    const calculatedSubtotal = cartData.items.reduce((sum, item) => {
      return sum + (Number(item.totalPrice) || 0)
    }, 0)

    const calculatedGrandTotal = calculatedSubtotal - discount

    const orderItems: CreateOrderItem[] = cartData.items.map((item: CartItem) => {
      let productIdString: string

      if (typeof item.productId === "string") {
        productIdString = item.productId
      } else if (item.productId && typeof item.productId === "object" && "_id" in item.productId) {
        productIdString = String(item.productId._id)
      } else {
        console.error("[v0] Invalid productId format:", item.productId)
        productIdString = String(item.productId)
      }

      const normalizedProductType = (item.productType.charAt(0).toUpperCase() +
        item.productType.slice(1).toLowerCase()) as "Tour" | "Transport"

      console.log("[v0] Processing item:", {
        originalProductId: item.productId,
        extractedProductId: productIdString,
        originalProductType: item.productType,
        normalizedProductType: normalizedProductType,
      })

      return {
        productId: productIdString,
        productType: normalizedProductType,
        travelDate: item.travelDate,
        adults: item.adults || 1,
        children: item.children || 0,
        infants: item.infants || 0,
        unitPrice: Math.round(Number(item.unitPrice) || 0),
        totalPrice: Math.round(Number(item.totalPrice) || 0),
        appliedOfferId: appliedOffer?.id || item.appliedOfferId,
        notes: item.notes,
      }
    })

    return {
      customerName: customerData.name.trim(),
      customerEmail: customerData.email.trim().toLowerCase(),
      customerPhone: customerData.phone?.trim() || undefined,
      items: orderItems,
      subtotal: Math.round(calculatedSubtotal),
      grandTotal: Math.round(calculatedGrandTotal),
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,

      currency: "USD",
      cartId: cartData._id,
    }
  }

  const handleInitiatePayment = async () => {
    if (!cart || !customerInfo.name || !customerInfo.email) {
      setPaymentStatus("error")
      return
    }

    try {
      const orderData = convertCartToOrderData(cart, customerInfo)
      const orderDataInPEN = {
        ...orderData,
        currency: "PEN",
        subtotal: Math.round(orderData.subtotal * USD_TO_PEN),
        grandTotal: Math.round(orderData.grandTotal * USD_TO_PEN),
        items: orderData.items.map((item) => ({
          ...item,
          unitPrice: Math.round(item.unitPrice * USD_TO_PEN),
          totalPrice: Math.round(item.totalPrice * USD_TO_PEN),
        })),
      }

      console.log("[v0] COMPLETE Order data being sent to Izipay:", JSON.stringify(orderDataInPEN, null, 2))
      console.log("[v0] Order items count:", orderDataInPEN.items.length)
      console.log("[v0] Customer info:", {
        name: orderDataInPEN.customerName,
        email: orderDataInPEN.customerEmail,
        phone: orderDataInPEN.customerPhone,
      })

      await generateFormToken({ orderData: orderDataInPEN })
    } catch (err) {
      console.error("[v0] Error initializing payment:", err)
      setPaymentStatus("error")
    }
  }

  if (!mounted || cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some tours to your cart before proceeding to checkout</p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Tours
          </Link>
        </div>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-foreground mb-4">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground mb-8">
            Tu reservación ha sido confirmada. Revisa tu email para más detalles.
          </p>
          <Link
            href="/users/profile"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
          >
            Ver Mis Reservaciones
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <link rel="stylesheet" href="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.css" />

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
          <span className="text-white text-xs font-medium tracking-[0.3em] uppercase mb-3 opacity-0">
            Checkout Seguro
          </span>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Reservaciones</h1>
          <p className="text-white text-sm md:text-base max-w-md opacity-0">
            Revisa tu orden y procede con el pago seguro
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="space-y-6">
            <div>
              <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">Order Summary</span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-2">Your Reservation</h2>
            </div>

            <div className="bg-secondary p-6 space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-foreground/10 last:border-0 last:pb-0">
                  <div className="relative w-20 h-20 shrink-0 bg-background overflow-hidden">
                    <Image
                      src={getProductImage(item) || "/placeholder.svg"}
                      alt={getProductTitle(item)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-serif text-foreground mb-1 truncate">{getProductTitle(item)}</h3>
                    {item.travelDate && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(item.travelDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {item.adults && item.adults > 0 && <span>{item.adults} Adults</span>}
                      {item.children && item.children > 0 && <span>{item.children} Children</span>}
                      {item.infants && item.infants > 0 && <span>{item.infants} Infants</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-serif text-foreground">${(item.totalPrice ?? 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-foreground/10">
                <label className="block text-sm font-medium text-foreground mb-2">Have a coupon code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!appliedOffer}
                    className="flex-1 px-3 py-2 bg-background border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || couponLoading || !!appliedOffer}
                    className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                    Apply
                  </button>
                </div>
              </div>

              {appliedOffer && (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{appliedOffer.code} applied</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <div className="text-right">
                    <p className="text-foreground">${subtotal.toFixed(2)}</p>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <div className="text-right">
                      <p className="text-green-600">-${discount.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">${serviceFee.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <span className="text-base font-serif text-foreground">Total</span>
                  <div className="text-right">
                    <p className="text-xl font-serif text-foreground">${grandTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                      S/ {(grandTotal * USD_TO_PEN).toFixed(2)}
                      <span className="inline-flex items-center" title="Precio de referencia en soles">
                        <Info className="w-3 h-3" />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20">
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-600">Payment Error</p>
                  <p className="text-xs text-red-600/80 mt-1">{paymentError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <div>
              <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">Detalles de Pago</span>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mt-2">Completa tu Compra</h2>
            </div>

            {!formTokenData && (
              <div className="bg-secondary p-6 md:p-8 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  {user ? (
                    <div className="w-full px-4 py-3 bg-background/50 border border-foreground/10 text-foreground rounded">
                      {user.email}
                    </div>
                  ) : (
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors"
                      placeholder="juan@ejemplo.com"
                      required
                    />
                  )}
                  <div className="mt-3 flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Confirmación de Pago</p>
                      <p className="text-xs text-blue-600/80 mt-1">
                        Se enviará a este email la orden de pago confirmando el pago exitoso
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-accent transition-colors"
                    placeholder="+51 999 999 999"
                  />
                </div>
                <button
                  onClick={handleInitiatePayment}
                  disabled={paymentLoading || !customerInfo.name || !customerInfo.email}
                  className="w-full px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            )}

            {formTokenData && (
              <div className="bg-secondary p-6 md:p-8">
                <div
                  className="kr-embedded"
                  kr-form-token={formTokenData.formToken}
                  kr-post-url-success="/checkout/success"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
