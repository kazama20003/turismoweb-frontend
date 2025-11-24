"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { useRouter } from "next/navigation"

interface CustomCursorProps {
  children: React.ReactNode
  text?: string
  scrollToId?: string
  navigateTo?: string
}

export function CustomCursor({ children, text = "RESERVAR", scrollToId, navigateTo }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const isOverInteractiveRef = useRef(false)

  const isInteractiveElement = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false

    const interactiveTags = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "LABEL"]
    const interactiveRoles = ["button", "link", "menuitem", "tab"]

    let current: HTMLElement | null = element
    while (current && current !== wrapperRef.current) {
      if (current === cursorRef.current || current.hasAttribute("data-cursor-element")) {
        return false
      }

      if (
        interactiveTags.includes(current.tagName) ||
        interactiveRoles.includes(current.getAttribute("role") || "") ||
        current.hasAttribute("data-interactive") ||
        current.classList.contains("cursor-pointer")
      ) {
        return true
      }
      current = current.parentElement
    }
    return false
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    const wrapper = wrapperRef.current
    if (!cursor || !wrapper) return

    let animationFrameId: number

    const moveCursor = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId)

      animationFrameId = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect()

        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          gsap.to(cursor, {
            x: e.clientX - 32,
            y: e.clientY - 32,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          })
        }
      })

      const target = e.target as HTMLElement
      isOverInteractiveRef.current = isInteractiveElement(target)
    }

    const enterArea = () => setIsHovering(true)
    const leaveArea = () => {
      setIsHovering(false)
      isOverInteractiveRef.current = false
    }

    wrapper.addEventListener("mousemove", moveCursor)
    wrapper.addEventListener("mouseenter", enterArea)
    wrapper.addEventListener("mouseleave", leaveArea)

    return () => {
      wrapper.removeEventListener("mousemove", moveCursor)
      wrapper.removeEventListener("mouseenter", enterArea)
      wrapper.removeEventListener("mouseleave", leaveArea)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isInteractiveElement])

  useEffect(() => {
    if (!cursorRef.current || !textRef.current) return

    gsap.to(cursorRef.current, {
      scale: isHovering ? 1 : 0,
      opacity: isHovering ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    })

    gsap.to(textRef.current, {
      opacity: isHovering ? 1 : 0,
      duration: 0.15,
      ease: "none",
    })
  }, [isHovering])

  const handleWrapperClick = () => {
    // Si el click es sobre un elemento interactivo, dejar que funcione normalmente
    if (isOverInteractiveRef.current) {
      return
    }

    // Si NO es elemento interactivo, ejecutar la acción del cursor
    if (navigateTo) {
      router.push(navigateTo)
    } else if (scrollToId) {
      const element = document.getElementById(scrollToId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div ref={wrapperRef} className="relative" onClick={handleWrapperClick}>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center select-none"
        style={{ opacity: 0, transform: "scale(0)" }}
        data-cursor-element="true"
      >
        <div
          ref={textRef}
          className="absolute text-black text-xs font-bold whitespace-nowrap select-none pointer-events-none"
          style={{ opacity: 0 }}
        >
          {text}
        </div>

        <div className="w-full h-full bg-white rounded-full pointer-events-none" />
      </div>

      <div style={{ cursor: "none" }}>{children}</div>
    </div>
  )
}
