"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Search, ArrowRight, Clock, Wine, Star } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const tours = [
  {
    id: 1,
    title: "Maxwell Wine Tasting",
    subtitle: "A Journey Through Flavour",
    description:
      "Immerse yourself in our signature tasting experience. Choose from curated wine flights showcasing the terroir of McLaren Vale, complemented by artisanal local produce.",
    price: 20,
    duration: "1 Hour",
    image: "/elegant-wine-tasting-room-with-fireplace.jpg",
    highlights: ["5 Premium Wines", "Tasting Notes", "Expert Guidance"],
    featured: true,
  },
  {
    id: 2,
    title: "Vineyard Experience",
    subtitle: "Walk Among the Vines",
    description:
      "Journey through our historic vineyards with passionate guides who share the stories behind every row. End with an exclusive tasting under the Australian sky.",
    price: 45,
    duration: "2 Hours",
    image: "/aerial-view-of-green-vineyard-rows.jpg",
    highlights: ["Guided Walk", "History & Heritage", "Sunset Tasting"],
    featured: false,
  },
  {
    id: 3,
    title: "Private Cellar Tour",
    subtitle: "Behind Closed Doors",
    description:
      "Descend into the heart of our winemaking. This intimate experience grants exclusive access to our barrel room, where our sommelier reveals the secrets of ageing and blending.",
    price: 75,
    duration: "1.5 Hours",
    image: "/dark-wine-cellar-with-oak-barrels.jpg",
    highlights: ["Barrel Tasting", "Limited Access", "Take Home Bottle"],
    featured: true,
  },
  {
    id: 4,
    title: "Food & Wine Pairing",
    subtitle: "Culinary Excellence",
    description:
      "A gastronomic journey where each course is meticulously paired with our finest vintages. Our chef and sommelier collaborate to create an unforgettable sensory experience.",
    price: 95,
    duration: "2.5 Hours",
    image: "/gourmet-food-wine-pairing-elegant-restaurant.jpg",
    highlights: ["5-Course Menu", "Sommelier Led", "Seasonal Menu"],
    featured: false,
  },
]

function TourCard({ tour, index }: { tour: (typeof tours)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

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
        {/* Image Section - Reducido aspect ratio a 4/3 en desktop */}
        <div ref={imageRef} className="relative w-full lg:w-1/2 aspect-[4/3] overflow-hidden">
          <img
            src={tour.image || "/placeholder.svg"}
            alt={tour.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {tour.featured && (
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-xs font-medium tracking-widest uppercase">
              <Star className="w-3 h-3" />
              Featured
            </div>
          )}

          <div className="absolute bottom-6 left-6 lg:hidden">
            <span className="text-white text-3xl font-serif">${tour.price}</span>
            <span className="text-white/70 text-sm ml-1">per person</span>
          </div>
        </div>

        {/* Content Section - Reducido padding */}
        <div
          ref={contentRef}
          className="relative w-full lg:w-1/2 p-6 lg:p-8 xl:p-10 flex flex-col justify-center bg-secondary"
        >
          <div
            ref={lineRef}
            className="absolute top-0 left-6 lg:left-8 xl:left-10 w-px h-8 bg-foreground/20 origin-top"
          />

          <div className="space-y-4">
            <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">{tour.subtitle}</span>

            <h3 className="text-2xl md:text-3xl xl:text-4xl font-serif text-foreground leading-tight">{tour.title}</h3>

            <div className="w-16 h-px bg-accent" />

            <p className="text-muted-foreground leading-relaxed max-w-lg">{tour.description}</p>

            <div className="flex flex-wrap gap-2">
              {tour.highlights.map((highlight, i) => (
                <span key={i} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs tracking-wider">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-2xl font-serif text-foreground">${tour.price}</span>
                <span className="text-xs">per person</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                Book Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>

              <button className="inline-flex items-center gap-3 px-6 py-3 border border-foreground/20 text-foreground text-xs font-medium tracking-widest uppercase hover:bg-foreground hover:text-background transition-all hover:scale-[1.02] active:scale-[0.98]">
                Gift Voucher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

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
    { id: "all", label: "All Experiences" },
    { id: "tasting", label: "Tastings" },
    { id: "tour", label: "Tours" },
    { id: "dining", label: "Dining" },
  ]

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
            McLaren Vale, South Australia
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Experiences</h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">
            Curated moments that celebrate the art of winemaking
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 px-4 bg-secondary">
        <div ref={introRef} className="max-w-4xl mx-auto text-center">
          <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">Discover</span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-6 text-foreground">
            Add On To Your
            <span className="italic block mt-2">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            From intimate tastings to immersive vineyard walks, each experience is crafted to reveal the passion and
            precision behind every bottle of Maxwell wine.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 px-4 bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-12 pr-4 py-3 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
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
          <div className="divide-y divide-foreground/10">
            {filteredTours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>
        </div>

        {filteredTours.length === 0 && (
          <div className="py-24 text-center">
            <Wine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No experiences found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Create Your Own Experience</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Looking for something bespoke? Our team can craft a private experience tailored to your preferences and
            group size.
          </p>
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground text-xs font-medium tracking-widest uppercase hover:bg-accent/90 transition-colors">
            Enquire Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  )
}
