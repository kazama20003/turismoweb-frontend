"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/context"

gsap.registerPlugin(ScrollTrigger)

export function PaymentMethodsSection() {
  const { dictionary } = useTranslation()
  const dict = dictionary.paymentMethods

  const containerRef = useRef<HTMLDivElement>(null)
  const topLeftRef = useRef<HTMLDivElement>(null)
  const bottomRightRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const paymentMethods = [
    { name: "Visa", logo: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1765989974/Visa_Inc._logo_ounvgj.svg" },
    {
      name: "Mastercard",
      logo: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1765989990/2560px-MasterCard_Logo.svg_hed2pt.png",
    },
    {
      name: "American Express",
      logo: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1765990006/American_Express_logo__282018_29_rtp1bw.svg",
    },
    {
      name: "Diners Club",
      logo: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1765990023/2560px-Diners_Club_Logo3.svg_u44inc.png",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [topLeftRef.current, bottomRightRef.current, cardsRef.current]

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
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="w-full bg-white border-l-8 border-r-8 border-white">
      <div className="border-t-8 border-white" />

      <div ref={containerRef} className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/ddbzpbrje/image/upload/v1765989893/pexels-mikhail-nilov-6612282_aund7w.jpg"
            alt="Payment background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="absolute inset-4 md:inset-6 lg:inset-8 border border-white/80 pointer-events-none z-20" />

        <div
          ref={topLeftRef}
          className="absolute top-10 md:top-14 lg:top-16 left-10 md:left-14 lg:left-16 z-10 max-w-xs md:max-w-sm"
        >
          <h2 className="text-white font-bold text-sm md:text-base tracking-wider uppercase mb-4 md:mb-6">
            {dict.title}
          </h2>

          <div className="border-l-2 border-white/60 pl-4">
            <p className="text-white italic text-sm md:text-base leading-relaxed mb-2">{dict.quote}</p>
            <p className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase">{dict.quoteAuthor}</p>
          </div>
        </div>

        <div
          ref={bottomRightRef}
          className="absolute bottom-10 md:bottom-14 lg:bottom-16 right-10 md:right-14 lg:right-16 z-10 max-w-xs md:max-w-md text-right"
        >
          <p className="text-white text-sm md:text-base leading-relaxed mb-4">{dict.description}</p>

          <div ref={cardsRef} className="flex items-center justify-end gap-2 md:gap-3 mb-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="w-10 h-6 md:w-12 md:h-8 bg-white rounded flex items-center justify-center p-1"
              >
                <Image
                  src={method.logo || "/placeholder.svg"}
                  alt={method.name}
                  width={40}
                  height={24}
                  className="object-contain max-w-full max-h-full"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            ))}
          </div>

          <a
            href="#"
            className="inline-flex items-center text-white text-xs md:text-sm font-semibold tracking-wider uppercase hover:opacity-80 transition-opacity"
          >
            {dict.ctaText}
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
