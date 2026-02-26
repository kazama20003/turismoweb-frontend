"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MailCheck, Search, ShoppingCart, Wallet } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

gsap.registerPlugin(ScrollTrigger)

export function BookingStepsSection() {
  const { locale, dictionary } = useTranslation()
  const dict = dictionary.bookingStepsSection

  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const topElements = [badgeRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current]

      topElements.forEach((el) => {
        if (!el) return

        gsap.set(el, { opacity: 0, y: 40 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 72%",
            scrub: 0.1,
          },
        })
      })

      if (stepsRef.current) {
        const cards = stepsRef.current.querySelectorAll("[data-step-card]")
        gsap.set(cards, { opacity: 0, y: 35 })
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 88%",
            end: "top 66%",
            scrub: 0.1,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const icons = [Search, ShoppingCart, Wallet, MailCheck]

  return (
    <section className="w-full bg-white overflow-x-hidden border-t-8 border-white">
      <div ref={containerRef} className="py-12 md:py-16 px-8 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p
            ref={badgeRef}
            className="inline-flex items-center border border-black/20 px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-black/80 mb-4"
          >
            {dict.badge}
          </p>

          <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight max-w-4xl">
            {dict.title}
          </h2>
          <p ref={subtitleRef} className="text-2xl md:text-3xl italic text-black/70 font-light mt-2 max-w-4xl">
            {dict.subtitle}
          </p>
          <p ref={descriptionRef} className="text-sm md:text-base text-black/80 leading-relaxed mt-5 max-w-3xl">
            {dict.description}
          </p>

          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
            {dict.steps.map((step, index) => {
              const Icon = icons[index] ?? Search

              return (
                <article
                  key={`${step.title}-${index}`}
                  data-step-card
                  className="border border-black/15 bg-neutral-50 p-5 sm:p-6 min-h-[220px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white text-xs font-semibold">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-black/70" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-black leading-snug mb-3">{step.title}</h3>
                  <p className="text-sm text-black/70 leading-relaxed">{step.description}</p>
                </article>
              )
            })}
          </div>

          <div ref={ctaRef} className="mt-8 border border-black bg-black text-white p-6 sm:p-7 md:p-8">
            <p className="text-sm sm:text-base text-white/90 mb-4">{dict.confirmationText}</p>
            <Link
              href={`/${locale}/tours`}
              className="inline-flex w-fit items-center justify-center border border-white px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-white hover:text-black transition-colors"
            >
              {dict.ctaButton}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
