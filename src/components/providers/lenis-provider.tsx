"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    lenis?: Lenis
  }
}

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.2,
    })

    window.lenis = lenis

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  return <>{children}</>
}

