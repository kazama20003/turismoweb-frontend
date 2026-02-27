"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { MailCheck, Search, ShoppingCart, Wallet } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

gsap.registerPlugin(ScrollTrigger)

export function PaymentMethodsSection() {
  const { locale, dictionary } = useTranslation()
  const dict = dictionary.paymentMethods
  const bookingDict = dictionary.bookingStepsSection

  const containerRef = useRef<HTMLDivElement>(null)
  const topContentRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const bottomContentRef = useRef<HTMLDivElement>(null)
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

  const stepIcons = [Search, ShoppingCart, Wallet, MailCheck]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [topContentRef.current, stepsRef.current, bottomContentRef.current, cardsRef.current]

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

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden min-h-[980px] sm:min-h-[900px] md:min-h-[860px] lg:min-h-[940px]"
      >
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/ddbzpbrje/image/upload/v1765989893/pexels-mikhail-nilov-6612282_aund7w.jpg"
            alt="Payment background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute inset-4 md:inset-6 lg:inset-8 border border-white/80 pointer-events-none z-20" />

        <div className="relative z-10 flex h-full min-h-[980px] flex-col px-5 py-8 sm:min-h-[900px] sm:px-8 md:min-h-[860px] md:px-0 md:py-0 lg:min-h-[940px]">
          <div ref={topContentRef} className="md:absolute md:top-14 lg:top-16 md:left-14 md:right-14 lg:left-16 lg:right-16">
            <p className="inline-flex border border-white/60 bg-black/25 px-3 py-1.5 text-[11px] md:text-xs text-white tracking-[0.2em] uppercase font-semibold mb-4">
              {bookingDict.badge}
            </p>
            <h2 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight max-w-3xl">{bookingDict.title}</h2>
            <p className="text-white/85 italic text-sm md:text-base lg:text-lg mt-2 max-w-2xl">{bookingDict.subtitle}</p>
            <p className="text-white/80 text-xs md:text-sm mt-3 max-w-3xl">{bookingDict.description}</p>

            <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
              {bookingDict.steps.map((step, index) => {
                const Icon = stepIcons[index] ?? Search

                return (
                  <article key={`${step.title}-${index}`} className="border border-white/40 bg-black/25 backdrop-blur-sm p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-white text-black text-xs font-semibold">
                        {index + 1}
                      </span>
                      <Icon className="h-4 w-4 text-white/85" />
                    </div>
                    <h3 className="text-white text-sm font-semibold leading-snug mb-1.5">{step.title}</h3>
                    <p className="text-white/75 text-xs leading-relaxed">{step.description}</p>
                  </article>
                )
              })}
            </div>
          </div>

          <div
            ref={bottomContentRef}
            className="mt-8 flex flex-col gap-6 md:mt-auto md:absolute md:bottom-14 lg:bottom-16 md:left-14 md:right-14 lg:left-16 lg:right-16 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-md border-l-2 border-white/60 pl-4">
              <h3 className="text-white font-bold text-sm md:text-base tracking-wider uppercase mb-3">{dict.title}</h3>
              <p className="text-white italic text-sm md:text-base leading-relaxed mb-2">{dict.quote}</p>
              <p className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase">{dict.quoteAuthor}</p>
            </div>

            <div className="max-w-full sm:max-w-md lg:text-right">
              <p className="text-white text-sm md:text-base leading-relaxed mb-4">{dict.description}</p>

              <div ref={cardsRef} className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 lg:justify-end">
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

              <Link
                href={`/${locale}/tours`}
                className="inline-flex items-center text-white text-xs md:text-sm font-semibold tracking-wider uppercase hover:opacity-80 transition-opacity"
              >
                {bookingDict.ctaButton}
                <span className="ml-2">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
