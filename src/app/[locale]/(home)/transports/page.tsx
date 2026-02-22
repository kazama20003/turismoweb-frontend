"use client"

import { useState, useRef, useEffect, use } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Clock, Users, Bus, Calendar, ArrowRight } from "lucide-react"
import { useTransports } from "@/hooks/use-transports"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { getTransportsDictionary } from "@/lib/i18n/dictionaries/transports"
import type { Transport, WeekDay } from "@/types/transport"
import Image from "next/image"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
}

const categories = [
  { id: "all", labelKey: "all" },
  { id: "popular", labelKey: "popular" },
  { id: "airport", labelKey: "airport" },
  { id: "cities", labelKey: "cities" },
  { id: "touristic", labelKey: "touristic" },
]

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

function TransportCard({
  transport,
  dictionary,
  locale,
}: {
  transport: Transport
  dictionary: ReturnType<typeof getTransportsDictionary>
  locale: Locale
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const t = dictionary.card

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

  const vehicleData = typeof transport.vehicle === "object" ? transport.vehicle : null
  const imageUrl = transport.images?.[0]?.url || "/placeholder.svg"

  const formatDuration = () => {
    const parts = []
    if (transport.durationHours) parts.push(`${transport.durationHours} ${t.hours}`)
    if (transport.durationMinutes) parts.push(`${transport.durationMinutes} ${t.minutes}`)
    return parts.join(" ") || "-"
  }

  const formatDepartureTime = () => {
    if (!transport.departureTime) return null
    // If time is in HH:MM format, return as is
    if (transport.departureTime.match(/^\d{2}:\d{2}$/)) {
      return transport.departureTime
    }
    // If time includes date, extract time portion
    try {
      const date = new Date(transport.departureTime)
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return transport.departureTime
    }
  }

  const availableDates = generateAvailableDates(transport.availableDays)
  const hasAvailableDates = availableDates.length > 0
  const rawSlug = typeof transport.slug === "string" ? transport.slug.trim() : ""
  const safeSlug = rawSlug && rawSlug !== "undefined" && rawSlug !== "null" ? rawSlug : null
  const detailIdentifier = safeSlug || transport._id
  const detailHref = `/${locale}/transports/${detailIdentifier}`

  return (
    <div ref={cardRef} className="group opacity-0">
      <div className="relative aspect-3/4 overflow-hidden bg-muted mb-4">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={transport.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {transport.oldPrice && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs tracking-widest uppercase">
            {Math.round(((transport.oldPrice - transport.currentPrice) / transport.oldPrice) * 100)}% OFF
          </span>
        )}
      </div>

      <h3 className="text-lg font-serif text-foreground mb-1">{transport.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{transport.description}</p>

      <div className="flex flex-col gap-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {transport.origin.name} → {transport.destination.name}
          </span>
        </div>

        {/* Added departure time display */}
        {formatDepartureTime() && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formatDepartureTime()}</span>
            {transport.arrivalTime && <span className="text-xs">(llegada: {transport.arrivalTime})</span>}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDuration()}</span>
          </div>
          {vehicleData && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {vehicleData.capacity} {t.passengers}
              </span>
            </div>
          )}
        </div>

        {transport.availableDays && transport.availableDays.length > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {transport.availableDays.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {WEEKDAY_LABELS[day]}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="font-medium text-foreground text-lg">${transport.currentPrice}</span>
        {transport.oldPrice && (
          <>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground line-through">${transport.oldPrice}</span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Link href={detailHref}>
          <button className="w-full py-2.5 bg-secondary text-foreground border border-border text-xs font-medium tracking-widest uppercase hover:bg-accent transition-colors flex items-center justify-center gap-2">
            {t.viewDetails}
            <ArrowRight className="w-3 h-3" />
          </button>
        </Link>

        <AddToCartButton
          productId={transport._id}
          productType="transport"
          productTitle={transport.title}
          productImage={imageUrl}
          productDescription={transport.description}
          unitPrice={transport.currentPrice}
          availabilityType={hasAvailableDates ? "fixed_dates" : "unlimited"}
          availableDates={availableDates}
          className="w-full"
          triggerChildren={
            <button className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors">
              {t.bookNow}
            </button>
          }
        />
      </div>
    </div>
  )
}

export default function TransportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = use(params)
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale
  const dictionary = getTransportsDictionary(locale)

  const [activeCategory, setActiveCategory] = useState("all")
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { data, isLoading } = useTransports(1, 20, locale)

  const transports: Transport[] = Array.isArray(data) ? data : []

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
    })

    return () => ctx.revert()
  }, [])

  const filteredTransports = transports.filter(() => {
    return activeCategory === "all" || true
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
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
          <span className="text-white/70 text-xs font-medium tracking-[0.3em] uppercase mb-3 opacity-0">
            {dictionary.hero.subtitle}
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">
            {dictionary.hero.title}
          </h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">{dictionary.hero.description}</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="px-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap rounded-full border transition-all ${
                  activeCategory === category.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {dictionary.filters[category.labelKey as keyof typeof dictionary.filters]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Transports Section */}
      <section className="py-16 bg-secondary">
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
            {/* Left Title */}
            <div className="lg:sticky lg:top-24">
              <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                {dictionary.section.title}
                <br />
                <span className="italic">{dictionary.section.titleItalic}</span>
              </h2>
            </div>

            {/* Transports Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {isLoading ? (
                <div className="col-span-full py-24 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">{dictionary.section.loading}</p>
                </div>
              ) : filteredTransports.length > 0 ? (
                filteredTransports.map((transport) => (
                  <TransportCard key={transport._id} transport={transport} dictionary={dictionary} locale={locale} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{dictionary.section.noResults}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
