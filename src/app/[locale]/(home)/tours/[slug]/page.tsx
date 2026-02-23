"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Calendar,
  Play,
  ChevronLeft,
  ChevronDown,
  Shield,
  Utensils,
  Hotel,
  Users,
  Globe,
  Mountain,
  Car,
  UserCheck,
  Info,
  X,
} from "lucide-react"
import { useTourBySlug } from "@/hooks/use-tours"
import { Skeleton } from "@/components/ui/skeleton"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { getTourDetailDictionary } from "@/lib/i18n/dictionaries/tour-detail"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { WhatsappButton } from "@/components/home/whatsapp-button"
import type { Vehicle } from "@/types/vehicle"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TourDetailPage() {
  const params = useParams()
  const localeParam = params.locale as string
  const slug = params.slug as string
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale

  const dict = useMemo(() => getTourDetailDictionary(locale), [locale])
  const { data: tour, isLoading, error } = useTourBySlug(slug, locale)

  const [activeSection, setActiveSection] = useState("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tour) return

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

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      }
    })
    return () => ctx.revert()
  }, [tour])

  const sections = [
    { id: "overview", label: dict.sections.overview },
    { id: "itinerary", label: dict.sections.itinerary },
    { id: "included", label: dict.sections.included },
    { id: "policies", label: dict.sections.policies },
  ]

  const duration = tour
    ? tour.durationDays > 0
      ? `${tour.durationDays} ${tour.durationDays > 1 ? dict.hero.days : dict.hero.day}`
      : `${tour.durationHours || 1} ${(tour.durationHours || 1) > 1 ? dict.hero.hours : dict.hero.hour}`
    : ""

  const nextImage = () => {
    if (tour?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % tour.images!.length)
    }
  }

  const prevImage = () => {
    if (tour?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + tour.images!.length) % tour.images!.length)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-secondary text-foreground"
    }
  }

  const getVehicles = (): Vehicle[] => {
    if (!tour?.vehicleIds) return []
    return tour.vehicleIds.filter((v): v is Vehicle => typeof v !== "string")
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="h-[80vh] relative">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Tour not found</p>
          <Link
            href={`/${locale}/tours`}
            className="px-6 py-3 bg-foreground text-background text-xs font-medium tracking-widest uppercase"
          >
            {dict.breadcrumb.tours}
          </Link>
        </div>
      </main>
    )
  }

  const currentImage =
    tour.images?.[currentImageIndex]?.url || `/placeholder.svg?height=800&width=1200&query=${tour.title}`

  const vehicles = getVehicles()

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
        <div ref={heroVideoRef} className="absolute inset-0">
          {showVideo && tour.videoUrl ? (
            <video
              src={tour.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              controls
              playsInline
            />
          ) : (
            <>
              <Image src={currentImage || "/placeholder.svg"} alt={tour.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/30" />
            </>
          )}
        </div>

        {/* Gallery Controls */}
        {tour.images && tour.images.length > 1 && !showVideo && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {tour.images.slice(0, 5).map((img, i) => (
                <button
                  key={img._id || i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-16 h-12 overflow-hidden border-2 transition-all ${
                    currentImageIndex === i ? "border-white" : "border-white/30"
                  }`}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt=""
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Video Toggle */}
        {tour.videoUrl && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="absolute top-20 right-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium tracking-wider uppercase flex items-center gap-2 hover:bg-white/30 transition-colors z-10"
          >
            {showVideo ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {showVideo ? "Close" : "Video"}
          </button>
        )}

        <div
          ref={heroContentRef}
          className="absolute inset-0 flex flex-col items-start justify-end text-left px-4 sm:px-6 pb-12"
        >
          {tour.categories && tour.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tour.categories.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs tracking-wider uppercase"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <span className="text-white/70 text-xs font-medium tracking-[0.3em] uppercase mb-3">{tour.locationName}</span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2">{tour.title}</h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            {tour.rating !== undefined && tour.rating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{tour.rating.toFixed(1)}</span>
                {tour.reviewsCount !== undefined && (
                  <span className="text-white/60">
                    ({tour.reviewsCount} {dict.hero.reviews})
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{tour.locationName}</span>
            </div>
            {tour.difficulty && (
              <span className={`px-3 py-1 text-xs font-medium uppercase ${getDifficultyColor(tour.difficulty)}`}>
                {dict.overview.difficultyLevels[tour.difficulty]}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {dict.breadcrumb.home}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              href={`/${locale}/tours`}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {dict.breadcrumb.tours}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-[300px]">{tour.title}</span>
          </nav>
        </div>
      </section>

      {/* Section Navigation */}
      <nav className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-4 text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all border-b-2 ${
                  activeSection === section.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              {activeSection === "overview" && (
                <div className="space-y-8">
                  <div>
                    <p className="text-muted-foreground text-lg leading-relaxed">{tour.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-background text-center">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                        {dict.hero.duration}
                      </span>
                      <span className="font-medium">{duration}</span>
                    </div>
                    {tour.startTime && (
                      <div className="p-4 bg-background text-center">
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          {dict.overview.startTime}
                        </span>
                        <span className="font-medium">{tour.startTime}</span>
                        {tour.endTime && (
                          <span className="text-xs text-muted-foreground block mt-1">- {tour.endTime}</span>
                        )}
                      </div>
                    )}
                    {tour.difficulty && (
                      <div className="p-4 bg-background text-center">
                        <Mountain className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          {dict.overview.difficulty}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-sm font-medium ${getDifficultyColor(tour.difficulty)}`}
                        >
                          {dict.overview.difficultyLevels[tour.difficulty]}
                        </span>
                      </div>
                    )}
                    {tour.minAge && (
                      <div className="p-4 bg-background text-center">
                        <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          {dict.overview.minAge}
                        </span>
                        <span className="font-medium">
                          {tour.minAge}+ {dict.overview.years}
                        </span>
                      </div>
                    )}
                    {tour.capacity && (
                      <div className="p-4 bg-background text-center">
                        <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          {dict.overview.capacity}
                        </span>
                        <span className="font-medium">{tour.capacity} max</span>
                      </div>
                    )}
                    {tour.hasTransport && (
                      <div className="p-4 bg-background text-center">
                        <Car className="w-5 h-5 mx-auto mb-2 text-green-600" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          Transporte
                        </span>
                        <span className="font-medium text-green-600">{dict.overview.included}</span>
                      </div>
                    )}
                    {tour.hasGuide && (
                      <div className="p-4 bg-background text-center">
                        <UserCheck className="w-5 h-5 mx-auto mb-2 text-green-600" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">Guía</span>
                        <span className="font-medium text-green-600">{dict.overview.included}</span>
                      </div>
                    )}
                    {tour.languages && tour.languages.length > 0 && (
                      <div className="p-4 bg-background text-center col-span-2">
                        <Globe className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">
                          {dict.overview.languages}
                        </span>
                        <span className="font-medium uppercase">{tour.languages.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {vehicles.length > 0 && (
                    <div>
                      <h3 className="text-xl font-serif mb-4">Vehículos del Tour</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {vehicles.map((vehicle) => (
                          <div key={vehicle._id} className="flex gap-4 p-4 bg-background border rounded-lg">
                            {vehicle.images?.[0] && (
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={vehicle.images[0].url || "/placeholder.svg"}
                                  alt={vehicle.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{vehicle.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  {vehicle.capacity} pasajeros
                                </Badge>
                                {vehicle.isActive && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                    Disponible
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights / Benefits */}
                  {tour.benefits && tour.benefits.length > 0 && (
                    <div>
                      <h3 className="text-xl font-serif mb-4">{dict.overview.highlights}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {tour.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-background">
                            <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tour.meetingPoint && (
                    <div className="p-6 bg-background border-l-4 border-primary">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {dict.overview.meetingPoint}
                      </h4>
                      <p className="text-muted-foreground">{tour.meetingPoint}</p>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "itinerary" && (
                <div className="space-y-4">
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    [...tour.itinerary].sort((a, b) => a.order - b.order).map((day, idx) => {
                      const hasDescription = Boolean(day.description?.trim())
                      const hasImages = Boolean(day.images && day.images.length > 0)
                      const hasActivities = Boolean(day.activities && day.activities.length > 0)
                      const hasMealsOrHotel = Boolean(
                        day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner || day.hotelNight,
                      )
                      const hasAnyDetail = hasDescription || hasImages || hasActivities || hasMealsOrHotel

                      return (
                        <div key={day._id || idx} className="bg-background overflow-hidden">
                          <button
                            onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                {day.order}
                              </span>
                              <div className="text-left">
                                <h3 className="font-semibold text-lg">{day.title}</h3>
                                {day.durationHours && (
                                  <p className="text-sm text-muted-foreground">
                                    {day.durationHours} {day.durationHours > 1 ? dict.hero.hours : dict.hero.hour}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-muted-foreground transition-transform ${
                                expandedDay === idx ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {expandedDay === idx && (
                            <div className="p-6 pt-0 space-y-4 border-t">
                              {hasDescription && <p className="text-muted-foreground leading-relaxed">{day.description}</p>}

                              {hasImages && (
                                <div className="space-y-2">
                                  <h4 className="font-medium">Galeria del dia</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {day.images?.map((imageUrl, imageIndex) => (
                                      <div
                                        key={`${day._id || day.order}-img-${imageIndex}`}
                                        className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted/30"
                                      >
                                        <Image
                                          src={imageUrl || "/placeholder.svg"}
                                          alt={`${day.title || `Dia ${day.order}`} ${imageIndex + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {hasActivities && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    {dict.itinerary.activities}
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {day.activities?.map((activity, i) => (
                                      <li key={i}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {hasMealsOrHotel && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                  {day.meals?.breakfast && (
                                    <Badge variant="outline" className="gap-1">
                                      <Utensils className="w-3 h-3" />
                                      {dict.itinerary.meals.breakfast}
                                    </Badge>
                                  )}
                                  {day.meals?.lunch && (
                                    <Badge variant="outline" className="gap-1">
                                      <Utensils className="w-3 h-3" />
                                      {dict.itinerary.meals.lunch}
                                    </Badge>
                                  )}
                                  {day.meals?.dinner && (
                                    <Badge variant="outline" className="gap-1">
                                      <Utensils className="w-3 h-3" />
                                      {dict.itinerary.meals.dinner}
                                    </Badge>
                                  )}
                                  {day.hotelNight && (
                                    <Badge variant="outline" className="gap-1">
                                      <Hotel className="w-3 h-3" />
                                      {dict.itinerary.hotelNight}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {!hasAnyDetail && <p className="text-sm text-muted-foreground">{dict.sections.noInfo}</p>}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{dict.sections.noInfo}</p>
                  )}
                </div>
              )}

              {/* Included / Excluded */}
              {activeSection === "included" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      {dict.sections.included}
                    </h3>
                    <ul className="space-y-3">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-green-600 text-xs">✓</span>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-600" />
                      {dict.sections.excluded}
                    </h3>
                    <ul className="space-y-3">
                      {tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-red-600" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === "policies" && (
                <div className="space-y-6">
                  {tour.changePolicy && (
                    <div className="p-6 bg-background border-l-4 border-primary">
                      <h4 className="font-semibold text-lg mb-2">Política de Cambios</h4>
                      <p className="text-muted-foreground">{tour.changePolicy}</p>
                    </div>
                  )}
                  {tour.refundPolicy && (
                    <div className="p-6 bg-background border-l-4 border-orange-500">
                      <h4 className="font-semibold text-lg mb-2">Política de Reembolso</h4>
                      <p className="text-muted-foreground">{tour.refundPolicy}</p>
                    </div>
                  )}
                  {tour.cancellationPolicy && (
                    <div className="p-6 bg-background border-l-4 border-red-500">
                      <h4 className="font-semibold text-lg mb-2">Política de Cancelación</h4>
                      <p className="text-muted-foreground">{tour.cancellationPolicy}</p>
                    </div>
                  )}
                  {tour.preparations && tour.preparations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Preparación</h4>
                      <ul className="space-y-2">
                        {tour.preparations.map((prep, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            {prep}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar - Booking */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-background p-6 space-y-6 shadow-lg border">
                <div>
                  <div className="flex items-baseline gap-2">
                    {tour.oldPrice && (
                      <span className="text-lg text-muted-foreground line-through">${tour.oldPrice.toFixed(2)}</span>
                    )}
                    <span className="text-3xl font-bold">${tour.currentPrice.toFixed(2)}</span>
                    <span className="text-muted-foreground">/ persona</span>
                  </div>
                  {tour.oldPrice && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Ahorra ${(tour.oldPrice - tour.currentPrice).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {tour.availabilityType === "unlimited" ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Disponible todos los días
                      </p>
                      <p className="text-xs text-green-600 mt-1">Puedes reservar cualquier día del año</p>
                    </div>
                  ) : tour.availabilityType === "fixed_dates" ? (
                    <>
                      <h4 className="font-semibold text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Fechas Disponibles
                      </h4>
                      {tour.availableDates && tour.availableDates.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {tour.availableDates.map((date, i) => (
                            <div
                              key={i}
                              className="text-sm font-medium p-3 bg-muted hover:bg-muted/70 rounded-lg border border-border transition-colors"
                            >
                              {new Date(date).toLocaleDateString(locale, {
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
                          No hay fechas disponibles actualmente
                        </p>
                      )}
                    </>
                  ) : null}
                </div>

                <div className="space-y-3 mb-6">
                  <AddToCartButton
                    productId={tour._id}
                    productType="tour"
                    productTitle={tour.title}
                    productImage={currentImage}
                    productDescription={tour.description}
                    unitPrice={tour.currentPrice}
                    className="w-full"
                    triggerChildren={
                      <button className="w-full py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors">
                        {dict.cta.bookNow}
                      </button>
                    }
                  />
                  <WhatsappButton productName={tour.title} className="w-full" />
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-start gap-3 text-sm">
                    <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {tour.instantConfirmation ? "Confirmación Instantánea" : "Confirmación en 24h"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tour.instantConfirmation
                          ? "Recibirás tu confirmación inmediatamente"
                          : "Te confirmaremos en las próximas 24 horas"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Pagos Seguros y Encriptados</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tu información está protegida con la mejor tecnología
                      </p>
                    </div>
                  </div>

                  {tour.changePolicy && (
                    <div className="flex items-start gap-3 text-sm">
                      <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Modificación de Fechas</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{tour.changePolicy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{dict.cta.title}</h2>
          <p className="text-background/80 mb-8 text-lg">{dict.cta.description}</p>
          <Link
            href={`/${locale}/about`}
            className="inline-block px-8 py-4 bg-background text-foreground text-xs font-medium tracking-widest uppercase hover:bg-background/90 transition-colors"
          >
            {dict.cta.button}
          </Link>
        </div>
      </section>
    </main>
  )
}
