"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Search, ArrowRight, Clock, Wine, Star } from "lucide-react"
import { useTours } from "@/hooks/use-tours"
import type { Tour } from "@/types/tour"
import { Skeleton } from "@/components/ui/skeleton"
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config"
import { getToursDictionary, type ToursDictionary } from "@/lib/i18n/dictionaries/tours"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function TourCard({ tour, index, dict, locale }: { tour: Tour; index: number; dict: ToursDictionary; locale: Locale }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  const duration =
    tour.durationDays > 0
      ? `${tour.durationDays} ${tour.durationDays > 1 ? dict.card.days : dict.card.day}`
      : `${tour.durationHours || 1} ${(tour.durationHours || 1) > 1 ? dict.card.hours : dict.card.hour}`

  const highlights = tour.benefits?.slice(0, 3) || tour.includes?.slice(0, 3) || []

  const isFeatured = (tour.rating || 0) >= 4.5

  const showVideo = index % 2 === 1 && !!tour.videoUrl
  const displayImage =
    tour.images?.[0]?.url || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(tour.title)}`

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const content = contentRef.current
    const line = lineRef.current

    if (!card || !image || !content || !line) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )

      const imageInner = image.querySelector("img")
      if (imageInner) {
        card.addEventListener("mouseenter", () => {
          gsap.to(imageInner, { scale: 1.05, duration: 0.7, ease: "power2.out" })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(imageInner, { scale: 1, duration: 0.7, ease: "power2.out" })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={cardRef} className="group opacity-0 py-6">
      <div className={`flex flex-col lg:flex-row ${isEven ? "" : "lg:flex-row-reverse"}`}>
        {/* Image/Video Section */}
        <div ref={imageRef} className="relative w-full lg:w-1/2 aspect-4/3 overflow-hidden">
          {showVideo ? (
            <video
              src={tour.videoUrl}
              className="absolute inset-0 w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={displayImage || "/placeholder.svg"}
              alt={tour.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

          {isFeatured && (
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-xs font-medium tracking-widest uppercase">
              <Star className="w-3 h-3" />
              {dict.card.featured}
            </div>
          )}

          <div className="absolute bottom-6 left-6 lg:hidden">
            <span className="text-white text-3xl font-serif">${tour.currentPrice}</span>
            <span className="text-white/70 text-sm ml-1">{dict.card.perPerson}</span>
          </div>
        </div>

        {/* Content Section */}
        <div
          ref={contentRef}
          className="relative w-full lg:w-1/2 p-6 lg:p-8 xl:p-10 flex flex-col justify-center bg-secondary"
        >
          <div
            ref={lineRef}
            className="absolute top-0 left-6 lg:left-8 xl:left-10 w-px h-8 bg-foreground/20 origin-top"
          />

          <div className="space-y-4">
            <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">{tour.locationName}</span>

            <h3 className="text-2xl md:text-3xl xl:text-4xl font-serif text-foreground leading-tight">{tour.title}</h3>

            <div className="w-16 h-px bg-accent" />

            <p className="text-muted-foreground leading-relaxed max-w-lg line-clamp-3">{tour.description}</p>

            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {highlights.map((highlight, i) => (
                  <span key={i} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs tracking-wider">
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              {tour.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{tour.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-2xl font-serif text-foreground">${tour.currentPrice}</span>
                {tour.oldPrice && tour.oldPrice > tour.currentPrice && (
                  <span className="text-sm line-through">${tour.oldPrice}</span>
                )}
                <span className="text-xs">{dict.card.perPerson}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <AddToCartButton
                productId={tour._id}
                productType="tour"
                productTitle={tour.title}
                productImage={displayImage}
                productDescription={tour.description}
                unitPrice={tour.currentPrice}
                availabilityType={tour.availabilityType}
                availableDates={tour.availableDates}
                triggerChildren={
                  <button className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {dict.card.book}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                }
              />

              <Link
                href={`/${locale}/tours/${tour.slug}`}
                className="inline-flex items-center gap-3 px-6 py-3 border border-foreground/20 text-foreground text-xs font-medium tracking-widest uppercase hover:bg-foreground hover:text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {dict.card.viewDetails}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TourCardSkeleton({ index }: { index: number }) {
  const isEven = index % 2 === 0
  return (
    <div className="py-6">
      <div className={`flex flex-col lg:flex-row ${isEven ? "" : "lg:flex-row-reverse"}`}>
        <Skeleton className="w-full lg:w-1/2 aspect-4/3" />
        <div className="w-full lg:w-1/2 p-6 lg:p-8 xl:p-10 bg-secondary space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-px w-16" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const params = useParams()
  const localeParam = params.locale as string
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale

  const dict = useMemo(() => getToursDictionary(locale), [locale])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [page, setPage] = useState(1)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, error } = useTours(page, 10, locale)
  const tours = data?.data ?? []

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

      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
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
  }, [])

  const filters = [
    { id: "all", label: dict.search.filters.all },
    { id: "adventure", label: dict.search.filters.adventure },
    { id: "cultural", label: dict.search.filters.cultural },
    { id: "nature", label: dict.search.filters.nature },
  ]

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
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
          className="absolute inset-0 flex flex-col items-start justify-end text-left px-4 sm:px-6 pb-12"
        >
          <span className="text-white/70 text-xs font-medium tracking-[0.3em] uppercase mb-3 opacity-0">
            {dict.hero.location}
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">{dict.hero.title}</h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">{dict.hero.subtitle}</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 px-4 bg-secondary">
        <div ref={introRef} className="max-w-4xl mx-auto text-center">
          <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">{dict.intro.badge}</span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-6 text-foreground">
            {dict.intro.title}
            <span className="italic block mt-2">{dict.intro.titleItalic}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">{dict.intro.description}</p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 md:py-12 px-4 bg-secondary border-y border-border overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={dict.search.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-12 pr-4 py-3 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tours List */}
      <section className="bg-secondary">
        <div className="px-4 md:px-8 lg:px-12">
          {/* Loading State */}
          {isLoading && (
            <div className="divide-y divide-foreground/10">
              {Array.from({ length: 4 }).map((_, i) => (
                <TourCardSkeleton key={i} index={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-24 text-center">
              <Wine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{dict.empty.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase"
              >
                {dict.empty.retry}
              </button>
            </div>
          )}

          {/* Tours */}
          {!isLoading && !error && filteredTours.length > 0 && (
            <div className="divide-y divide-foreground/10">
              {filteredTours.map((tour, index) => (
                <TourCard key={tour._id} tour={tour} index={index} dict={dict} locale={locale} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredTours.length === 0 && (
            <div className="py-24 text-center">
              <Wine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{dict.empty.noResults}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-12">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 text-sm font-medium transition-all ${
                  page === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-foreground">
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-background">{dict.cta.title}</h2>
          <p className="text-background/70 mb-8 max-w-xl mx-auto">{dict.cta.description}</p>
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-background text-foreground text-xs font-medium tracking-widest uppercase hover:bg-background/90 transition-colors">
            {dict.cta.button}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  )
}
