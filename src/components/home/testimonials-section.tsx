"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Locale } from "@/lib/i18n/config"
import { getTestimonialsDictionary } from "@/lib/i18n/dictionaries/testimonials"

gsap.registerPlugin(ScrollTrigger)

interface TestimonialsSectionProps {
  locale: Locale
}

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const dictionary = getTestimonialsDictionary(locale)

  const testimonials = [
    {
      id: 1,
      name: dictionary.testimonial1Name,
      role: dictionary.testimonial1Role,
      comment: dictionary.testimonial1Comment,
      image: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1760740352/main-sample.png",
      rating: 5,
    },
    {
      id: 2,
      name: dictionary.testimonial2Name,
      role: dictionary.testimonial2Role,
      comment: dictionary.testimonial2Comment,
      image: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1760740347/samples/man-portrait.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: dictionary.testimonial3Name,
      role: dictionary.testimonial3Role,
      comment: dictionary.testimonial3Comment,
      image: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1760740334/samples/people/bicycle.jpg",
      rating: 5,
    },
    {
      id: 4,
      name: dictionary.testimonial4Name,
      role: dictionary.testimonial4Role,
      comment: dictionary.testimonial4Comment,
      image: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1760740333/samples/people/jazz.jpg",
      rating: 5,
    },
  ]

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const cardWidth = carousel.children[0]?.getBoundingClientRect().width || 0
    const gap = 16

    const updateCarousel = (index: number) => {
      gsap.to(carousel, {
        x: -(index * (cardWidth + gap)),
        duration: 0.6,
        ease: "power2.inOut",
      })
    }

    const handlePrev = () => {
      const newIndex = Math.max(0, currentIndex - 1)
      setCurrentIndex(newIndex)
      updateCarousel(newIndex)
    }

    const handleNext = () => {
      const newIndex = Math.min(testimonials.length - 1, currentIndex + 1)
      setCurrentIndex(newIndex)
      updateCarousel(newIndex)
    }

    const prevBtn = containerRef.current?.querySelector("[data-prev]")
    const nextBtn = containerRef.current?.querySelector("[data-next]")

    prevBtn?.addEventListener("click", handlePrev)
    nextBtn?.addEventListener("click", handleNext)

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 0.1,
          markers: false,
        },
      },
    )

    return () => {
      prevBtn?.removeEventListener("click", handlePrev)
      nextBtn?.removeEventListener("click", handleNext)
    }
  }, [currentIndex, testimonials.length])

  return (
    <section ref={containerRef} className="w-full bg-white py-16">
      <div className="w-full px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide uppercase">{dictionary.title}</h2>

          <div className="flex gap-2">
            <button
              data-prev
              className="w-10 h-10 border border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              data-next
              className="w-10 h-10 border border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div ref={carouselRef} className="flex gap-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="shrink-0 w-full md:w-1/4 h-96 relative group cursor-pointer overflow-hidden"
              >
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1 leading-tight">{testimonial.name}</h3>
                    <p className="text-xs text-white/70 uppercase tracking-wider">{testimonial.role}</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs md:text-sm leading-relaxed line-clamp-4 italic">{testimonial.comment}</p>
                  </div>

                  {/* Button */}
                  <button className="self-start px-3 py-2 bg-transparent border border-white text-white text-xs font-bold hover:bg-white hover:text-black transition-all duration-300 uppercase">
                    {dictionary.readMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
