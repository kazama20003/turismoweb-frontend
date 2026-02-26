"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Bus, ShieldCheck } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

gsap.registerPlugin(ScrollTrigger)

export function TransportSection() {
  const { locale, dictionary } = useTranslation()
  const dict = dictionary.transportSection

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [imageRef.current, titleRef.current, subtitleRef.current, contentRef.current]

      elements.forEach((el) => {
        if (!el) return

        gsap.set(el, { opacity: 0, y: 50 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 70%",
            scrub: 0.1,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="w-full bg-linear-to-b from-white to-neutral-100 overflow-x-hidden">
      <div ref={containerRef} className="py-12 md:py-16 px-8 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <p className="inline-flex items-center gap-2 border border-black/20 px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-black/80 mb-4">
            <Bus className="w-3.5 h-3.5" />
            {dict.imageLabel}
          </p>
          <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight max-w-4xl">
            {dict.title}
          </h2>
          <p ref={subtitleRef} className="text-2xl md:text-3xl italic text-black/70 font-light mt-2 max-w-4xl">
            {dict.titleLine2}
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[420px] md:min-h-[520px] lg:min-h-[600px]">
        <div ref={imageRef} className="relative min-h-[320px] lg:min-h-full overflow-hidden group">
          <Image
            src="https://res.cloudinary.com/demzflxgq/image/upload/v1772137305/markus-winkler-3vlGNkDep4E-unsplash_tagxpi.jpg"
            alt={dict.imageLabel}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <p className="inline-block border border-white/70 bg-black/20 text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase px-4 py-2">
              {dict.imageLabel}
            </p>
          </div>
          {dict.highlights[0] && (
            <div className="absolute bottom-6 left-6 right-6 max-w-md border border-white/30 bg-black/35 backdrop-blur-sm text-white px-4 py-3">
              <p className="text-xs sm:text-sm tracking-wide">{dict.highlights[0]}</p>
            </div>
          )}
        </div>

        <div ref={contentRef} className="relative bg-black text-white px-8 sm:px-12 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-14 flex flex-col justify-center">
          <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-black to-zinc-950" />
          <div className="relative max-w-xl">
            <div className="w-16 h-1 bg-white/70 mb-6" />
            <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6">{dict.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {dict.highlights.slice(0, 2).map((item, index) => (
                <div key={`${item}-${index}`} className="border border-white/20 bg-white/5 p-3">
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {dict.highlights.map((item, index) => (
                <li key={`${item}-${index}`} className="text-sm md:text-base text-white/90 flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/transports`}
              className="inline-flex w-fit items-center gap-2 justify-center border border-white px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-white hover:text-black transition-colors"
            >
              {dict.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
