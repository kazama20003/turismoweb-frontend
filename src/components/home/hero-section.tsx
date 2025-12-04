"use client"

import { useRef, useState, useEffect } from "react"

interface HeroSectionProps {
  title: string
  titleLine2: string
  description: string
  planVisit: string
  shopNow: string
}

export function HeroSection({ title, titleLine2, description, planVisit, shopNow }: HeroSectionProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioActive, setAudioActive] = useState(false) // inicia en mute REAL

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const unlockAudio = () => {
      audio
        .play()
        .then(() => {
          setAudioActive(true)
          console.log("Audio habilitado correctamente.")
        })
        .catch((err) => {
          console.log("Error al intentar reproducir:", err)
        })

      // eliminar listeners después de activarlo
      window.removeEventListener("click", unlockAudio)
      window.removeEventListener("touchstart", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
    }

    // primera interacción desbloquea audio
    window.addEventListener("click", unlockAudio)
    window.addEventListener("touchstart", unlockAudio)
    window.addEventListener("keydown", unlockAudio)

    return () => {
      window.removeEventListener("click", unlockAudio)
      window.removeEventListener("touchstart", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
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
    } catch (err) {
      console.log("Error toggling audio:", err)
    }
  }

  return (
    <section className="relative w-full h-screen overflow-hidden video-showcase hide-system-cursor">
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/1136148208?h=b661ea2878&muted=1&loop=1&background=1"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto 
                     -translate-x-1/2 -translate-y-1/2 scale-[1.2]"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-end">
          <div className="w-full px-8 sm:px-12 lg:px-16 pb-16 md:pb-20">
            <div className="max-w-2xl">
              {/* Replace static text with translation props */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {title} <br /> {titleLine2}
              </h1>

              <p className="text-lg md:text-xl text-white/90 italic font-light max-w-md mb-8">{description}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full px-8 sm:px-12 lg:px-16 pb-16 md:pb-20 flex justify-between items-end">
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

          {/* BUTTONS */}
          <div className="flex gap-6 items-center">
            {/* Update button text with translations */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/80 transition-all"
            >
              {planVisit}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="px-8 py-3 bg-transparent text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              {shopNow}
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
