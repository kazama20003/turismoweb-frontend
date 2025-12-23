"use client"

import { use, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Clock, Users, Calendar, ArrowLeft, ArrowRight, Car, Bus } from "lucide-react"
import { useTransportBySlug } from "@/hooks/use-transports"
import { useVehicle } from "@/hooks/use-vehicles"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { getTransportsDictionary } from "@/lib/i18n/dictionaries/transports"
import type { WeekDay } from "@/types/transport"
import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { WhatsappButton } from "@/components/home/whatsapp-button"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function generateAvailableDates(availableDays: WeekDay[] | undefined, daysAhead = 90): string[] {
  if (!availableDays || availableDays.length === 0) return []

  const weekdayMap: Record<WeekDay, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const allowedDays = availableDays.map((day) => weekdayMap[day])
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    if (allowedDays.includes(date.getDay())) {
      dates.push(date.toISOString().split("T")[0])
    }
  }

  return dates
}

export default function TransportDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: localeParam, slug } = use(params)
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale
  const dictionary = getTransportsDictionary(locale)
  const t = dictionary.detail

  const { data: transport, isLoading } = useTransportBySlug(slug, locale)

  const vehicleId = typeof transport?.vehicle === "string" ? transport.vehicle : null
  const { data: vehicleData, isLoading: isVehicleLoading } = useVehicle(vehicleId)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!transport) return

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

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [transport])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">{dictionary.section.loading}</p>
        </div>
      </main>
    )
  }

  if (!transport) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t.notFound}</p>
          <Link
            href={`/${locale}/transports`}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToTransports}
          </Link>
        </div>
      </main>
    )
  }

  const mainImage = transport.images?.[0]?.url || "/placeholder.svg"
  const availableDates = generateAvailableDates(transport.availableDays)
  const hasAvailableDates = availableDates.length > 0

  const formatDuration = () => {
    const parts = []
    if (transport.durationHours) parts.push(`${transport.durationHours} ${dictionary.card.hours}`)
    if (transport.durationMinutes) parts.push(`${transport.durationMinutes} ${dictionary.card.minutes}`)
    return parts.join(" ") || "-"
  }

  const formatDepartureTime = () => {
    if (!transport.departureTime) return null
    if (transport.departureTime.match(/^\d{2}:\d{2}$/)) {
      return transport.departureTime
    }
    try {
      const date = new Date(transport.departureTime)
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return transport.departureTime
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
        <div ref={heroVideoRef} className="absolute inset-0">
          <video
            src="https://res.cloudinary.com/ddbzpbrje/video/upload/v1763011237/11929213_1920_1080_60fps_lq178j.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div
          ref={heroContentRef}
          className="absolute inset-0 flex flex-col items-start justify-end text-left px-6 pb-12"
        >
          <Link
            href={`/${locale}/transports`}
            className="inline-flex items-center gap-2 text-white/70 text-xs font-medium tracking-[0.3em] uppercase mb-4 hover:text-white transition-colors opacity-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backButton}
          </Link>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">{transport.title}</h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">{transport.description}</p>
        </div>
      </section>

      <section className="py-6 bg-secondary border-b border-border">
        <div className="px-6">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{transport.origin.name}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{transport.destination.name}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
            {/* Left Title */}
            <div className="lg:sticky lg:top-24">
              <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-6">
                {t.tripDetails}
                <br />
                <span className="italic">&amp; {t.booking}</span>
              </h2>

              {/* Price display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-serif text-foreground">${transport.currentPrice}</span>
                  {transport.oldPrice && (
                    <span className="text-xl text-muted-foreground line-through">${transport.oldPrice}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{t.perPerson}</span>
              </div>

              {/* Book button */}
              <div className="space-y-3">
                <AddToCartButton
                  productId={transport._id}
                  productType="transport"
                  productTitle={transport.title}
                  productImage={mainImage}
                  productDescription={transport.description}
                  unitPrice={transport.currentPrice}
                  availabilityType={hasAvailableDates ? "fixed_dates" : "unlimited"}
                  availableDates={availableDates}
                  className="w-full"
                  triggerChildren={
                    <button className="w-full py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors">
                      {t.bookNow}
                    </button>
                  }
                />
                <WhatsappButton productName={transport.title} className="w-full" />
              </div>
            </div>

            {/* Right content */}
            <div ref={contentRef} className="space-y-12">
              {/* Image Gallery */}
              <div className="opacity-0">
                <div className="relative aspect-3/4 md:aspect-video overflow-hidden bg-muted mb-4">
                  <Image src={mainImage || "/placeholder.svg"} alt={transport.title} fill className="object-cover" />
                  {transport.oldPrice && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs tracking-widest uppercase">
                      {Math.round(((transport.oldPrice - transport.currentPrice) / transport.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {transport.images && transport.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {transport.images.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden bg-muted cursor-pointer group">
                        <Image
                          src={img.url || "/placeholder.svg"}
                          alt={`${transport.title} ${idx + 2}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trip Info Grid */}
              <div className="opacity-0 grid grid-cols-2 md:grid-cols-4 gap-6">
                {formatDepartureTime() && (
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs tracking-widest uppercase">{t.departure}</span>
                    </div>
                    <p className="text-lg font-serif">{formatDepartureTime()}</p>
                  </div>
                )}

                {transport.arrivalTime && (
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs tracking-widest uppercase">{t.arrival}</span>
                    </div>
                    <p className="text-lg font-serif">{transport.arrivalTime}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">{t.duration}</span>
                  </div>
                  <p className="text-lg font-serif">{formatDuration()}</p>
                </div>

                {vehicleData && (
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-xs tracking-widest uppercase">{t.capacity}</span>
                    </div>
                    <p className="text-lg font-serif">
                      {vehicleData.capacity} {t.passengers}
                    </p>
                  </div>
                )}
              </div>

              {/* Available Days */}
              {transport.availableDays && transport.availableDays.length > 0 && (
                <div className="opacity-0">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">{t.availableDays}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {transport.availableDays.map((day) => (
                      <Badge key={day} variant="outline" className="text-sm py-2 px-4">
                        {dictionary.weekdays[day]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="opacity-0">
                <h3 className="text-2xl font-serif text-foreground mb-4">{t.fullDescription}</h3>
                <p className="text-muted-foreground leading-relaxed">{transport.description}</p>
              </div>

              {/* Vehicle Details */}
              {vehicleData && !isVehicleLoading && (
                <div className="opacity-0">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Car className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">{t.vehicleDetails}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-background border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.brand}</p>
                      <p className="font-serif text-lg">{vehicleData.brand || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.model}</p>
                      <p className="font-serif text-lg">{vehicleData.model || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.plate}</p>
                      <p className="font-serif text-lg uppercase">{vehicleData.plate || "-"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
