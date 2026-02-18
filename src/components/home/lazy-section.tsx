"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

interface LazySectionProps {
  children: ReactNode
  placeholderHeight?: string
  rootMargin?: string
}

export function LazySection({
  children,
  placeholderHeight = "60vh",
  rootMargin = "300px",
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        setIsVisible(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(marker)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={markerRef}>
      {isVisible ? children : <div aria-hidden="true" style={{ minHeight: placeholderHeight }} />}
    </div>
  )
}

