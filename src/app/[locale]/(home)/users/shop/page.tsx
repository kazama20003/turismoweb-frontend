"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const categories = [
  { id: "all", label: "All Products" },
  { id: "textiles", label: "Textiles" },
  { id: "ceramics", label: "Ceramics" },
  { id: "jewelry", label: "Jewelry" },
  { id: "art", label: "Art" },
  { id: "gifts", label: "Gift Sets" },
]

const products = [
  {
    id: 1,
    name: "Alpaca Wool Blanket",
    description: "Handwoven by artisans in the Sacred Valley. Soft, luxurious, and ethically sourced.",
    price: 185,
    memberPrice: 148,
    category: "textiles",
    image: "/alpaca-wool-blanket-peruvian-textile-colorful.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Ceramic Chimu Vessel",
    description: "Replica of ancient Chimu pottery. Hand-painted with traditional motifs from Northern Peru.",
    price: 95,
    memberPrice: 76,
    category: "ceramics",
    image: "/peruvian-ceramic-vessel-chimu-pottery-dark.jpg",
  },
  {
    id: 3,
    name: "Silver Chakana Pendant",
    description: "Sterling silver Andean cross. Symbol of the Inca cosmology, handcrafted in Cusco.",
    price: 120,
    memberPrice: 96,
    category: "jewelry",
    image: "/silver-andean-cross-chakana-pendant-jewelry.jpg",
  },
  {
    id: 4,
    name: "Retablo Art Box",
    description: "Traditional Ayacucho retablo depicting village life. Each piece is unique and hand-carved.",
    price: 250,
    memberPrice: 200,
    category: "art",
    image: "/peruvian-retablo-art-box-colorful-folk-art.jpg",
    featured: true,
  },
  {
    id: 5,
    name: "Pisco Sour Gift Set",
    description: "Premium pisco, lime press, and recipe cards. Everything needed for the perfect cocktail.",
    price: 85,
    memberPrice: 68,
    category: "gifts",
    image: "/pisco-sour-cocktail-gift-set-bottle-glasses.jpg",
  },
  {
    id: 6,
    name: "Woven Aguayo Textile",
    description: "Traditional carrying cloth from the highlands. Vibrant colors and intricate patterns.",
    price: 145,
    memberPrice: 116,
    category: "textiles",
    image: "/peruvian-aguayo-textile-colorful-woven-fabric.jpg",
  },
]

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const [quantity, setQuantity] = useState(1)
  const cardRef = useRef<HTMLDivElement>(null)

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
    <div ref={cardRef} className="group opacity-0">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
              <Image
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

        {product.featured && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs tracking-widest uppercase">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-lg font-serif text-foreground mb-1">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="font-medium text-foreground">${product.price}</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">${product.memberPrice} Member Price</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-muted transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase hover:bg-primary/90 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [searchQuery, ] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || product.category === activeCategory
    return matchesSearch && matchesCategory
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
            Peru Travel World
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Shop</h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">
            Authentic Peruvian craftsmanship & curated excellence
          </p>
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
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-secondary">
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
            {/* Left Title */}
            <div className="lg:sticky lg:top-24">
              <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                A Legacy
                <br />
                <span className="italic">Of Craftsmanship</span>
              </h2>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
