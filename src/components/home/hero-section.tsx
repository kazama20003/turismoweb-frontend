"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const { dictionary } = useTranslation()
  const translations = dictionary.heroSection

  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const [audioActive, setAudioActive] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const video = videoRef.current

    if (video) {
      video.play().catch(() => {
        // Silenciar error de autoplay
      })
    }

    if (!audio) return

    const unlockAudio = () => {
      audio
        .play()
        .then(() => {
          setAudioActive(true)
        })
        .catch(() => {
          // Silenciar error de autoplay
        })

      window.removeEventListener("click", unlockAudio)
      window.removeEventListener("touchstart", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
    }

    window.addEventListener("click", unlockAudio)
    window.addEventListener("touchstart", unlockAudio)
    window.addEventListener("keydown", unlockAudio)

    return () => {
      window.removeEventListener("click", unlockAudio)
      window.removeEventListener("touchstart", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
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

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (audioActive) {
        audio.pause()
      } else {
        await audio.play()
      }
      setAudioActive(!audioActive)
    } catch {
      // Silenciar error
    }
  }

  return (
    <section className="relative w-full h-screen overflow-hidden video-showcase pt-16">
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

        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-8 md:pb-16 lg:pb-20 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0">
          {/* AUDIO BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleAudio()
            }}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white backdrop-blur-sm"
            aria-label="Toggle audio"
          >
            {audioActive ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 3a1 1 0 012 0v5a1 1 0 11-2 0V3zm3 7a1 1 0 012 0v2a1 1 0 11-2 0v-2zm3-5a1 1 0 112 0v7a1 1 0 11-2 0V5zM6 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0118 10a6.972 6.972 0 01-1.929 4.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0016 10c0-1.713-.672-3.259-1.757-4.372a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center w-full sm:w-auto">
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/80 transition-all text-sm sm:text-base"
            >
              {translations.planVisit}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-white font-semibold rounded-full hover:bg-white/10 transition-all border border-white text-sm sm:text-base"
            >
              {translations.shopNow}
            </button>
          </div>
        </div>
      </div>

      {/* AUDIO FILE */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/home/hero.m4a" type="audio/mp4" />
      </audio>
    </section>
  )
}
