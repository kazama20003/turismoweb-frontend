"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShoppingCart,
  Heart,
  Package,
  CreditCard,
  LogOut,
  Edit,
  Users,
  Wine,
  Star,
  ChevronRight,
  Trash2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Mock user data
const userData = {
  firstName: "Carlos",
  lastName: "Mendoza",
  email: "carlos.mendoza@email.com",
  phone: "+51 987 654 321",
  address: "Av. La Marina 123, Miraflores, Lima",
  memberSince: "2023-06-15",
  membershipTier: "Gold Member",
  points: 1250,
}

// Mock reservations
const userReservations = [
  {
    id: "RES-001",
    type: "Wine Tasting",
    date: "2024-02-15",
    time: "2:00 PM",
    guests: 4,
    status: "confirmed",
  },
  {
    id: "RES-002",
    type: "Restaurant",
    date: "2024-02-20",
    time: "7:00 PM",
    guests: 2,
    status: "pending",
  },
]

// Mock cart items
const cartItems = [
  {
    id: 1,
    name: "Reserva Especial Malbec 2020",
    price: 125,
    quantity: 2,
    image: "/wine-bottles-arranged-elegantly-with-grapes.jpg",
  },
  {
    id: 2,
    name: "Gran Reserva Tannat 2019",
    price: 145,
    quantity: 1,
    image: "/elegant-wine-cellar-with-bottles-and-ambient-light.jpg",
  },
]

// Mock favorites
const favorites = [
  {
    id: 1,
    name: "Reserva Especial Malbec 2020",
    price: 125,
    rating: 4.8,
    image: "/wine-bottles-arranged-elegantly-with-grapes.jpg",
  },
  {
    id: 2,
    name: "Premium Cabernet Sauvignon 2021",
    price: 95,
    rating: 4.6,
    image: "/elegant-wine-cellar-with-bottles-and-ambient-light.jpg",
  },
  {
    id: 3,
    name: "Gran Reserva Tannat 2019",
    price: 145,
    rating: 4.9,
    image: "/wine-bottles-arranged-elegantly-with-grapes.jpg",
  },
]

// Mock order history
const orderHistory = [
  {
    id: "ORD-2401",
    date: "2024-01-15",
    items: 3,
    total: 395,
    status: "delivered",
  },
  {
    id: "ORD-2312",
    date: "2023-12-20",
    items: 6,
    total: 720,
    status: "delivered",
  },
  {
    id: "ORD-2311",
    date: "2023-11-10",
    items: 2,
    total: 250,
    status: "delivered",
  },
]

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={cardRef} className="bg-secondary p-6 opacity-0">
      <Icon className="w-5 h-5 text-accent mb-3" />
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-serif text-foreground">{value}</p>
    </div>
  )
}

export default function ProfilePage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const ctx = gsap.context(() => {
      const elements = header.children
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-500/10 text-green-600"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600"
      case "cancelled":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-secondary pt-24 pb-12 px-4 md:px-8 lg:px-12">
        <div ref={headerRef} className="max-w-7xl mx-auto">
          {/* User Info */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                  {userData.firstName} {userData.lastName}
                </h1>
                <span className="text-xs px-3 py-1 bg-accent text-accent-foreground rounded-full tracking-wider uppercase w-fit">
                  {userData.membershipTier}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Member since{" "}
                {new Date(userData.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-background text-foreground border border-border text-xs font-medium tracking-widest uppercase hover:border-foreground transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label="Reservations" value={userReservations.length.toString()} />
            <StatCard icon={Package} label="Orders" value={orderHistory.length.toString()} />
            <StatCard icon={Heart} label="Favorites" value={favorites.length.toString()} />
            <StatCard icon={Star} label="Points" value={userData.points.toString()} />
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="w-full bg-secondary p-1 grid grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="overview" className="text-xs tracking-wider uppercase">
                Overview
              </TabsTrigger>
              <TabsTrigger value="reservations" className="text-xs tracking-wider uppercase">
                Reservations
              </TabsTrigger>
              <TabsTrigger value="cart" className="text-xs tracking-wider uppercase flex items-center gap-2">
                <ShoppingCart className="w-3 h-3" />
                Cart ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs tracking-wider uppercase">
                Orders
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs tracking-wider uppercase">
                Favorites
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Recent Reservations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-serif text-foreground">Recent Reservations</h3>
                  <Link
                    href="/reservations"
                    className="text-xs text-accent hover:text-accent/80 uppercase tracking-wider flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {userReservations.slice(0, 2).map((reservation) => (
                    <div key={reservation.id} className="bg-secondary p-6 flex items-center gap-6">
                      <Wine className="w-8 h-8 text-accent" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-accent font-medium tracking-wider uppercase">
                            {reservation.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(reservation.status)}`}
                          >
                            {reservation.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-serif text-foreground mb-1">{reservation.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reservation.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {reservation.time} • {reservation.guests} guests
                        </p>
                      </div>
                      <button className="text-xs text-foreground hover:text-accent uppercase tracking-wider">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-serif text-foreground">Recent Orders</h3>
                  <button className="text-xs text-accent hover:text-accent/80 uppercase tracking-wider flex items-center gap-1">
                    View All
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {orderHistory.slice(0, 2).map((order) => (
                    <div key={order.id} className="bg-secondary p-6 flex items-center gap-6">
                      <Package className="w-8 h-8 text-accent" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-accent font-medium tracking-wider uppercase">{order.id}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {order.items} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif text-foreground">${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif text-foreground">My Reservations</h3>
                <Link
                  href="/reservations"
                  className="px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
                >
                  New Reservation
                </Link>
              </div>
              {userReservations.map((reservation) => (
                <div key={reservation.id} className="bg-secondary p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-accent font-medium tracking-wider uppercase">{reservation.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <h4 className="text-xl font-serif text-foreground mb-2">{reservation.type}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(reservation.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{reservation.guests} guests</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-xs text-foreground font-medium tracking-wider uppercase hover:text-accent transition-colors">
                      Modify
                    </button>
                    <button className="text-xs text-red-500 font-medium tracking-wider uppercase hover:text-red-600 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Cart Tab */}
            <TabsContent value="cart" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif text-foreground">Shopping Cart</h3>
                <button className="text-xs text-red-500 hover:text-red-600 uppercase tracking-wider flex items-center gap-2">
                  <Trash2 className="w-3 h-3" />
                  Clear Cart
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-secondary p-6 flex gap-6">
                      <div className="w-24 h-24 bg-muted flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-serif text-foreground mb-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">${item.price} per bottle</p>
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 bg-background flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
                            -
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button className="w-8 h-8 bg-background flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <button className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-lg font-serif text-foreground">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="bg-secondary p-6 h-fit sticky top-24">
                  <h4 className="text-xl font-serif text-foreground mb-6">Order Summary</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">
                        ${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.18).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Total</span>
                      <span className="text-xl font-serif text-foreground">
                        ${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.18).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button className="w-full px-6 py-4 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <h3 className="text-2xl font-serif text-foreground mb-6">Order History</h3>
              {orderHistory.map((order) => (
                <div key={order.id} className="bg-secondary p-6 flex items-center gap-6">
                  <Package className="w-10 h-10 text-accent" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-accent font-medium tracking-wider uppercase">{order.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      • {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif text-foreground mb-2">${order.total}</p>
                    <button className="text-xs text-accent hover:text-accent/80 uppercase tracking-wider">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <h3 className="text-2xl font-serif text-foreground mb-6">My Favorites</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative aspect-[3/4] bg-muted mb-4 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-lg font-serif text-foreground flex-1">{item.name}</h4>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-base font-medium text-foreground mb-3">${item.price}</p>
                    <button className="w-full py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
