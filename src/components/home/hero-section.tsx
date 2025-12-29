"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/context"
import { useProfile } from "@/hooks/use-auth"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const { dictionary } = useTranslation()
  const translations = dictionary.heroSection
  const router = useRouter()
  const { data: user } = useProfile()

  const videoRef = useRef<HTMLVideoElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.play().catch(() => {
        // Autoplay error
      })
    }
  }, [])

  useEffect(() => {
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, { y: 100, opacity: 0 })

      ScrollTrigger.create({
        trigger: buttonsRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.to(buttonsRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          })
        },
        once: true,
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handlePlanVisit = () => {
    const phoneNumber = "51901206784"
    const message = encodeURIComponent("Hola, me interesa planificar una visita a Perú")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handleShopNow = () => {
    if (user) {
      router.push("/tours")
    } else {
      router.push("/login")
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden video-showcase pt-14 sm:pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-[1.05] md:scale-[1.2]"
        >
          <source
            src="https://res.cloudinary.com/djldb5hqg/video/upload/v1766447444/YTDown.com_YouTube_Empieza-Tu-Aventura-en-Peru_Media_vgNus8s2tzs_002_720p_a5tzsg.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-end">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-12 md:pb-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {translations.title} <br /> {translations.titleLine2}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 italic font-light max-w-md mb-6 md:mb-8">
                {translations.description}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-8 md:pb-16 lg:pb-20">
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center w-full sm:w-auto">
            <button
              onClick={handlePlanVisit}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/80 transition-all text-sm sm:text-base"
            >
              {translations.planVisit}
            </button>
            <button
              onClick={handleShopNow}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-white font-semibold rounded-full hover:bg-white/10 transition-all border border-white text-sm sm:text-base"
            >
              {translations.shopNow}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
