"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "@/lib/i18n/context"
import { usePopularTours } from "@/hooks/use-tours"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

gsap.registerPlugin(ScrollTrigger)

export function ProductsSection() {
  const { locale, dictionary } = useTranslation()
  const dict = dictionary.productsSection
  const { data: tours, isLoading } = usePopularTours(locale)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const imagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elements = [
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      dividerRef.current,
      imagesContainerRef.current,
    ]

    elements.forEach((el) => {
      if (!el) return

      gsap.set(el, {
        opacity: 0,
        y: 50,
      })

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 70%",
          scrub: 0.1,
          markers: false,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const displayTours = tours?.slice(0, 4) || []

  return (
    <section id="products-section" className="w-full bg-white border-l-8 border-r-8 border-white">
      <div ref={dividerRef} className="border-t-8 border-white" />

      <div className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
            >
              {dict.title}
            </h2>
            <p ref={subtitleRef} className="text-xl sm:text-2xl md:text-3xl italic text-black/80 font-light mt-2">
              {dict.subtitle}
            </p>
          </div>

          <div ref={descriptionRef} className="mb-8 md:mb-12">
            <p className="text-xs sm:text-sm md:text-base text-black/90 leading-relaxed mb-4">{dict.description}</p>
            <button
              className="text-black font-semibold text-xs md:text-sm hover:opacity-70 transition-opacity w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              {dict.exploreTours}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={imagesContainerRef}
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t-8 border-white"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-screen overflow-hidden bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-black/40" />
                {index < 3 && (
                  <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-8 border-r-8 border-white" />
                )}
              </div>
              <div className="md:hidden border-b-4 border-white" />
            </div>
          ))
        ) : displayTours.length > 0 ? (
          displayTours.map((tour, index) => {
            const useVideo = index % 2 === 1 && tour.videoUrl
            const mainImage = tour.images?.[0]?.url || "/placeholder.svg"

            return (
              <div key={tour._id}>
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-screen overflow-hidden group">
                  {useVideo ? (
                    <video src={tour.videoUrl} autoPlay muted loop className="w-full h-full object-cover" />
                  ) : (
                    <Image
                      src={mainImage || "/placeholder.svg"}
                      alt={tour.title}
                      fill
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                      {tour.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-3 line-clamp-2">
                      {tour.description}
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">
                      ${tour.currentPrice.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4">
                      <AddToCartButton
                        productId={tour._id}
                        productType="tour"
                        productTitle={tour.title}
                        productImage={tour.images?.[0]?.url}
                        productDescription={tour.description}
                        unitPrice={tour.currentPrice}
                        availabilityType={tour.availabilityType}
                        availableDates={tour.availableDates}
                        triggerChildren={
                          <button className="text-white font-semibold text-xs sm:text-sm underline hover:opacity-70 transition-opacity w-fit">
                            {dict.reserve}
                          </button>
                        }
                      />
                      <Link
                        href={`/${locale}/tours/${tour.slug}`}
                        className="text-white font-semibold text-xs sm:text-sm underline hover:opacity-70 transition-opacity w-fit"
                      >
                        {dict.viewDetails}
                      </Link>
                    </div>
                  </div>

                  {index < displayTours.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-8 border-r-8 border-white" />
                  )}
                </div>

                <div className="md:hidden border-b-4 border-white" />
              </div>
            )
          })
        ) : (
          <div className="col-span-full p-12 text-center text-gray-500">
            <p>No tours available at the moment</p>
          </div>
        )}
      </div>
    </section>
  )
}
