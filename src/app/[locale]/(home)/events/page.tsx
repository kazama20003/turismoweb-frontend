"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Search, ArrowRight, Calendar, MapPin, Clock, Star } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

interface FAQ {
  question: string
  answer: string
}

const events = [
  {
    id: 1,
    title: "Inti Raymi",
    subtitle: "Fiesta del Sol",
    description:
      "La celebración más importante del imperio incaico. Revive la majestuosidad de la Fiesta del Sol en Cusco, con ceremonias ancestrales, danzas tradicionales y la recreación del ritual al Dios Sol en Sacsayhuamán.",
    date: "24 de Junio",
    location: "Cusco, Perú",
    duration: "1 Día",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669373/Inti_Raymi_qzh4n6.jpg",
    highlights: ["Ceremonia Ancestral", "Danzas Típicas", "Sacsayhuamán"],
    featured: true,
    exclusive: true,
  },
  {
    id: 2,
    title: "Virgen de la Candelaria",
    subtitle: "Patrimonio de la Humanidad",
    description:
      "La festividad folclórica más grande de Sudamérica. Vive la explosión de color, música y devoción en Puno, con más de 40,000 danzarines y músicos que rinden homenaje a la Virgen de la Candelaria.",
    date: "2 de Febrero",
    location: "Puno, Perú",
    duration: "18 Días",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669374/679e6a450bf6667b4e1f0c6b_hdnon6.png",
    highlights: ["UNESCO Patrimonio", "Diablada", "Concurso de Danzas"],
    featured: true,
    exclusive: true,
  },
  {
    id: 3,
    title: "Aniversario de Arequipa",
    subtitle: "La Ciudad Blanca",
    description:
      "Celebra el aniversario de la fundación española de Arequipa. Disfruta de serenatas, pasacalles, fuegos artificiales y la tradicional quema de castillos en la emblemática Plaza de Armas.",
    date: "15 de Agosto",
    location: "Arequipa, Perú",
    duration: "10 Días",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669373/corso2-1024x630_buajva.jpg",
    highlights: ["Pasacalles", "Fuegos Artificiales", "Corso de la Amistad"],
    featured: false,
    exclusive: true,
  },
  {
    id: 4,
    title: "Corso Alegórico de Primavera",
    subtitle: "Trujillo Florece",
    description:
      "El evento más colorido del norte peruano. Carros alegóricos decorados con miles de flores desfilan por las calles de Trujillo, acompañados de reinas de belleza y bandas musicales.",
    date: "Septiembre",
    location: "Trujillo, Perú",
    duration: "1 Semana",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669372/Carro_Aleg%C3%B3rico_en_Trujillo._Corso_del_63__Festival_Internacional_de_la_Primavera_ao2txy.jpg",
    highlights: ["Carros Florales", "Reinas de Belleza", "Marinera"],
    featured: false,
    exclusive: true,
  },
  {
    id: 5,
    title: "Señor de los Milagros",
    subtitle: "El Mes Morado",
    description:
      "La procesión religiosa más multitudinaria de América. Acompaña al Cristo Moreno en su recorrido por las calles de Lima, envuelto en el fervor de miles de devotos vestidos de morado.",
    date: "Octubre",
    location: "Lima, Perú",
    duration: "Todo Octubre",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669373/000541322W_qi4ugs.webp",
    highlights: ["Procesión", "Turrón", "Tradición Colonial"],
    featured: true,
    exclusive: true,
  },
  {
    id: 6,
    title: "Qoyllur Rit'i",
    subtitle: "Peregrinación Andina",
    description:
      "Una de las peregrinaciones más impresionantes del mundo. Miles de devotos ascienden al nevado Ausangate para venerar al Señor de Qoyllur Rit'i, fusionando tradiciones incaicas y católicas.",
    date: "Mayo - Junio",
    location: "Cusco, Perú",
    duration: "3 Días",
    image: "https://res.cloudinary.com/djldb5hqg/image/upload/v1765669516/Qoyllur-Riti_og5ohg.png",
    highlights: ["Peregrinación", "Ukukus", "Nevado Ausangate"],
    featured: false,
    exclusive: true,
  },
]

const faqs: FAQ[] = [
  {
    question: "¿Cómo puedo reservar un evento exclusivo?",
    answer:
      "Los eventos exclusivos requieren reserva previa. Haz clic en 'Reservar Ahora' en el evento de tu interés y completa el formulario. Nuestro equipo te contactará para confirmar disponibilidad y detalles.",
  },
  {
    question: "¿Qué incluye el paquete de evento?",
    answer:
      "Cada paquete incluye transporte desde el punto de encuentro, guía especializado bilingüe, acceso preferencial a las ceremonias, y en algunos casos alojamiento y alimentación. Los detalles varían según el evento.",
  },
  {
    question: "¿Cuánto tiempo antes debo reservar?",
    answer:
      "Recomendamos reservar con al menos 2-3 meses de anticipación, especialmente para eventos como Inti Raymi y la Candelaria, ya que las plazas son limitadas y la demanda es muy alta.",
  },
  {
    question: "¿Los eventos son aptos para toda la familia?",
    answer:
      "La mayoría de nuestros eventos son aptos para toda la familia. Sin embargo, algunos como Qoyllur Rit'i requieren condición física para caminatas en altura. Consulta los requisitos específicos de cada evento.",
  },
  {
    question: "¿Qué pasa si el evento se cancela por clima?",
    answer:
      "En caso de cancelación por condiciones climáticas extremas, ofrecemos reprogramación sin costo adicional o reembolso completo. Los eventos culturales rara vez se cancelan ya que son parte de tradiciones ancestrales.",
  },
  {
    question: "¿Puedo solicitar un tour privado para grupos?",
    answer:
      "Sí, ofrecemos experiencias privadas para grupos de 6 o más personas. Incluyen guía exclusivo, transporte privado y accesos VIP. Contáctanos para cotización personalizada.",
  },
]

function EventCard({ event, index }: { event: (typeof events)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const line = lineRef.current

    if (!card || !image || !line) return

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
        {/* Image Section */}
        <div ref={imageRef} className="relative w-full lg:w-1/2 aspect-[4/3] overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {event.featured && (
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-xs font-medium tracking-widest uppercase">
              <Star className="w-3 h-3" />
              Destacado
            </div>
          )}

          {event.exclusive && (
            <div className="absolute top-6 right-6 px-4 py-2 bg-foreground text-background text-xs font-medium tracking-widest uppercase">
              Exclusivo
            </div>
          )}

          <div className="absolute bottom-6 left-6 lg:hidden">
            <span className="text-white text-2xl font-serif">{event.date}</span>
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
            <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">{event.subtitle}</span>

            <h3 className="text-2xl md:text-3xl xl:text-4xl font-serif text-foreground leading-tight">{event.title}</h3>

            <div className="w-16 h-px bg-accent" />

            <p className="text-muted-foreground leading-relaxed max-w-lg">{event.description}</p>

            <div className="flex flex-wrap gap-2">
              {event.highlights.map((highlight, i) => (
                <span key={i} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs tracking-wider">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.duration}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                Reservar Ahora
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>

              <button className="inline-flex items-center gap-3 px-6 py-3 border border-foreground/20 text-foreground text-xs font-medium tracking-widest uppercase hover:bg-foreground hover:text-background transition-all hover:scale-[1.02] active:scale-[0.98]">
                Más Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="opacity-0">
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-border bg-background px-6 data-[state=open]:border-foreground transition-all duration-300"
          >
            <AccordionTrigger className="py-6 hover:no-underline group">
              <div className="flex items-center gap-4 text-left">
                <span className="text-muted-foreground text-sm font-mono">0{index + 1}</span>
                <span className="text-foreground font-medium group-hover:text-muted-foreground transition-colors">
                  {faq.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const faqTitleRef = useRef<HTMLHeadingElement>(null)

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

      if (faqTitleRef.current) {
        gsap.fromTo(
          faqTitleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faqTitleRef.current,
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
    { id: "all", label: "Todos" },
    { id: "religious", label: "Religiosos" },
    { id: "cultural", label: "Culturales" },
    { id: "patronal", label: "Patronales" },
  ]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
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
            Experiencias Exclusivas
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif mb-2 opacity-0">Eventos</h1>

          <p className="text-white/60 text-sm md:text-base max-w-md opacity-0">
            Festividades únicas que solo ocurren en fechas especiales
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 px-4 bg-secondary">
        <div ref={introRef} className="max-w-4xl mx-auto text-center">
          <span className="text-accent text-xs font-medium tracking-[0.3em] uppercase">Descubre</span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-6 text-foreground">
            Tradiciones
            <span className="italic block mt-2">Milenarias</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Vive experiencias únicas en las festividades más emblemáticas del Perú. Eventos exclusivos que celebran
            nuestra rica herencia cultural y solo ocurren en fechas específicas del año.
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
                placeholder="Buscar eventos..."
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

      {/* Events List */}
      <section className="bg-secondary">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="divide-y divide-foreground/10">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-24 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron eventos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </section>

      {/* FAQ Section - layout como club page */}
      <section className="py-16 bg-background">
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
            {/* Left Title - sticky */}
            <div className="lg:sticky lg:top-24">
              <h2 ref={faqTitleRef} className="text-3xl md:text-4xl font-serif text-foreground leading-tight opacity-0">
                Preguntas
                <br />
                <span className="italic">Frecuentes</span>
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Encuentra respuestas sobre nuestros eventos exclusivos y cómo reservar tu experiencia.
              </p>
            </div>

            {/* FAQ List */}
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">¿No encuentras tu evento?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Contáctanos para crear una experiencia personalizada en cualquier festividad del Perú. Nuestro equipo puede
            organizar tours privados a eventos regionales.
          </p>
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground text-xs font-medium tracking-widest uppercase hover:bg-accent/90 transition-colors">
            Consultar Ahora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  )
}
