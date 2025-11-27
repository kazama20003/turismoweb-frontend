"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  MapPin,
  Wine,
  Utensils,
  Mountain,
  Star,
  Plus,
  List,
  User,
  LogIn,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const reservationTypes = [
  {
    id: "wine-tasting",
    title: "Wine Tasting",
    subtitle: "Degustación de Vinos",
    description: "Experience our finest vintages with expert guidance through a curated selection of premium wines.",
    icon: Wine,
    duration: "1-2 Hours",
    groupSize: "2-12 guests",
    price: "From $45",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    subtitle: "Fine Dining Experience",
    description: "Savor exquisite Peruvian cuisine paired perfectly with our award-winning wines.",
    icon: Utensils,
    duration: "2-3 Hours",
    groupSize: "2-20 guests",
    price: "From $95",
  },
  {
    id: "vineyard-tour",
    title: "Vineyard Tour",
    subtitle: "Recorrido por el Viñedo",
    description: "Walk through our historic vineyards and learn the art of winemaking from seed to bottle.",
    icon: Mountain,
    duration: "1.5-2 Hours",
    groupSize: "4-15 guests",
    price: "From $65",
  },
  {
    id: "private-event",
    title: "Private Event",
    subtitle: "Evento Privado",
    description: "Host your special celebration in our exclusive venues with personalized service.",
    icon: Star,
    duration: "Customizable",
    groupSize: "10-100 guests",
    price: "Contact Us",
  },
]

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

// Mock existing reservations for demo
const mockReservations = [
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
  {
    id: "RES-003",
    type: "Vineyard Tour",
    date: "2024-01-10",
    time: "11:00 AM",
    guests: 6,
    status: "completed",
  },
]

function ReservationTypeCard({
  type,
  isSelected,
  onSelect,
}: {
  type: (typeof reservationTypes)[0]
  isSelected: boolean
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = type.icon

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      className={`group cursor-pointer p-6 transition-all duration-300 ${
        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-foreground"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon className={`w-6 h-6 ${isSelected ? "text-primary-foreground" : "text-accent"}`} />
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? "border-primary-foreground bg-primary-foreground" : "border-foreground/30"
          }`}
        >
          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>
      </div>

      <span
        className={`text-[10px] font-medium tracking-[0.2em] uppercase ${
          isSelected ? "text-primary-foreground/70" : "text-accent"
        }`}
      >
        {type.subtitle}
      </span>

      <h3 className="text-xl font-serif mt-1 mb-3">{type.title}</h3>

      <p
        className={`text-xs leading-relaxed mb-4 ${
          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {type.description}
      </p>

      <div className={`space-y-1 text-[10px] ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>{type.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>{type.groupSize}</span>
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t ${isSelected ? "border-primary-foreground/20" : "border-foreground/10"}`}>
        <span className="text-base font-serif">{type.price}</span>
      </div>
    </div>
  )
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-background p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2">Sign In to Continue</h3>
          <p className="text-muted-foreground text-sm">Access your reservations and manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email *"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Password *"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Link href="#" className="text-sm text-accent hover:underline block">
            Forgot your password?
          </Link>
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="#" className="text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function MyReservations() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "cancelled":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-foreground/10">
        <div>
          <h3 className="text-2xl md:text-3xl font-serif text-foreground">My Reservations</h3>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your bookings</p>
        </div>
        <Link
          href="#new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </Link>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {mockReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-background p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:bg-secondary/50 transition-colors"
          >
            {/* Type & ID */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs text-accent font-medium tracking-wider uppercase">{reservation.id}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusColor(reservation.status)}`}
                >
                  {reservation.status}
                </span>
              </div>
              <h4 className="text-lg font-serif text-foreground">{reservation.type}</h4>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{reservation.time}</span>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{reservation.guests} guests</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {reservation.status !== "completed" && reservation.status !== "cancelled" && (
                <>
                  <button className="text-xs text-foreground font-medium tracking-wider uppercase hover:text-accent transition-colors">
                    Modify
                  </button>
                  <button className="text-xs text-red-500 font-medium tracking-wider uppercase hover:text-red-600 transition-colors">
                    Cancel
                  </button>
                </>
              )}
              {reservation.status === "completed" && (
                <button className="text-xs text-foreground font-medium tracking-wider uppercase hover:text-accent transition-colors">
                  Book Again
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockReservations.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h4 className="text-xl font-serif text-foreground mb-2">No reservations yet</h4>
          <p className="text-muted-foreground text-sm mb-6">Start by creating your first reservation</p>
          <Link
            href="#new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase"
          >
            Make a Reservation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

function NewReservationForm() {
  const [selectedType, setSelectedType] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
    subscribe: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ selectedType, ...formData })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Select Type */}
      <div>
        <div className="mb-6">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">Step 1</span>
          <h3 className="text-2xl font-serif text-foreground mt-1">Choose Your Experience</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reservationTypes.map((type) => (
            <ReservationTypeCard
              key={type.id}
              type={type}
              isSelected={selectedType === type.id}
              onSelect={() => setSelectedType(type.id)}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background p-6 md:p-8">
          <div className="mb-6">
            <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">Step 2</span>
            <h3 className="text-2xl font-serif text-foreground mt-1">Your Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer text-sm"
                >
                  <option value="">Select Time *</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer text-sm"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Guest" : "Guests"}
                  </option>
                ))}
                <option value="20+">20+ Guests (Contact us)</option>
              </select>
            </div>

            <textarea
              name="specialRequests"
              placeholder="Special requests, dietary requirements..."
              rows={3}
              value={formData.specialRequests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
            />

            <div className="flex items-center gap-3">
              <Checkbox
                id="subscribe"
                checked={formData.subscribe}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, subscribe: checked as boolean }))}
              />
              <label htmlFor="subscribe" className="text-xs text-muted-foreground cursor-pointer">
                Subscribe to our newsletter for exclusive offers
              </label>
            </div>

            <button
              type="submit"
              disabled={!selectedType}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Confirm Reservation
              <ArrowRight className="w-4 h-4" />
            </button>

            {!selectedType && (
              <p className="text-center text-xs text-muted-foreground">Please select an experience type to continue</p>
            )}
          </form>
        </div>

        {/* Summary Card */}
        <div className="bg-secondary p-6 md:p-8 h-fit lg:sticky lg:top-8">
          <h4 className="text-lg font-serif text-foreground mb-6">Reservation Summary</h4>

          {selectedType ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-foreground/10">
                <div>
                  <span className="text-xs text-accent uppercase tracking-wider">Experience</span>
                  <p className="text-foreground font-medium mt-1">
                    {reservationTypes.find((t) => t.id === selectedType)?.title}
                  </p>
                </div>
                <span className="text-foreground font-serif">
                  {reservationTypes.find((t) => t.id === selectedType)?.price}
                </span>
              </div>

              {formData.date && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{formData.date}</span>
                </div>
              )}

              {formData.time && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{formData.time}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{formData.guests} guests</span>
              </div>

              <div className="pt-4 mt-4 border-t border-foreground/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground">Av. El Sol 380, Cusco</p>
                    <p className="text-muted-foreground">Peru 08000</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <Wine className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Select an experience to see your reservation summary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReservationsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("new")

  useEffect(() => {
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
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[50vh] overflow-hidden">
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
          <span className="text-white/70 text-xs font-medium tracking-[0.3em] uppercase mb-3 opacity-0">
            Reserve Your Experience
          </span>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Reservations</h1>
          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">
            Book your unforgettable wine experience in the heart of Peru
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-8 lg:px-12 bg-secondary">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-background p-1 mb-12">
            <TabsTrigger
              value="new"
              className="flex items-center gap-2 py-3 text-xs font-medium tracking-wider uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              New Reservation
            </TabsTrigger>
            <TabsTrigger
              value="my-reservations"
              className="flex items-center gap-2 py-3 text-xs font-medium tracking-wider uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <List className="w-4 h-4" />
              My Reservations
            </TabsTrigger>
          </TabsList>

          {/* New Reservation Tab */}
          <TabsContent value="new" className="mt-0">
            <NewReservationForm />
          </TabsContent>

          {/* My Reservations Tab */}
          <TabsContent value="my-reservations" className="mt-0">
            {isLoggedIn ? <MyReservations /> : <LoginPrompt onLogin={() => setIsLoggedIn(true)} />}
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Planning Something Special?</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto text-sm">
            For large groups, corporate events, or weddings, our dedicated events team will create a bespoke experience
            tailored to your vision.
          </p>
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground text-xs font-medium tracking-widest uppercase hover:bg-accent/90 transition-colors">
            Contact Events Team
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  )
}
