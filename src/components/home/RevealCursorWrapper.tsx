"use client"

import { useEffect, useState, useRef } from "react"

interface Props {
  children: React.ReactNode
  circleSize?: number
  enabledOnly?: boolean
}

export default function RevealCursorWrapper({ 
  children, 
  circleSize = 250,
  enabledOnly = false 
}: Props) {
  const [cursor, setCursor] = useState({ x: -9999, y: -9999 })
  const [isOverText, setIsOverText] = useState(false)
  const [isInside, setIsInside] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({
        x: e.clientX - circleSize / 2,
        y: e.clientY - circleSize / 2,
      })

      if (enabledOnly && wrapperRef.current) {
        const element = document.elementFromPoint(e.clientX, e.clientY)
        
        if (element) {
          // Revisar si es texto o elementos que contienen texto
          const isText = 
            element.tagName === 'H1' ||
            element.tagName === 'H2' ||
            element.tagName === 'H3' ||
            element.tagName === 'P' ||
            element.tagName === 'SPAN' ||
            element.tagName === 'A' ||
            element.tagName === 'BUTTON' ||
            element.classList.contains('text-element') ||
            (element as HTMLElement).innerText?.trim().length > 0
          
          setIsOverText(isText)
        }
      }
    }

    window.addEventListener("mousemove", move)

    return () => {
      window.removeEventListener("mousemove", move)
    }
  }, [circleSize, enabledOnly])

  const handleMouseEnter = () => {
    if (enabledOnly) setIsInside(true)
  }

  const handleMouseLeave = () => {
    if (enabledOnly) setIsInside(false)
    setCursor({ x: -9999, y: -9999 })
  }

  const dynamicSize = isOverText ? circleSize * 1.3 : circleSize

  // Si enabledOnly es true y no estamos dentro, no mostrar el cursor
  if (enabledOnly && !isInside) {
    return <>{children}</>
  }

  return (
    <div 
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* CÍRCULO DEL EFECTO MEJORADO */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-all duration-200"
        style={{
          width: dynamicSize,
          height: dynamicSize,
          backgroundColor: "white",
          mixBlendMode: "difference",
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          opacity: isInside ? 1 : 0,
        }}
      />

      {/* CONTENIDO */}
      {children}
    </div>
  )
}
