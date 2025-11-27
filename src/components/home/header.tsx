"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, Search, User, Menu, X, Globe } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const navItems = [
    { name: "TOURS", href: "/tours" },
    { name: "SHOP", href: "/shop" },
    { name: "VISIT", href: "/visit" },
    { name: "CLUB", href: "/club" },
    { name: "EVENTS", href: "/events" },
    { name: "ABOUT", href: "/about" },
  ]

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    gsap.set(header, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderBottomWidth: "0px",
      backdropFilter: "blur(0px)",
    })

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "80px top",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        setIsScrolled(progress > 0.5)

        gsap.to(header, {
          backgroundColor: `rgba(255, 255, 255, ${progress * 0.98})`,
          backdropFilter: `blur(${progress * 12}px)`,
          borderBottomWidth: `${progress * 1}px`,
          borderBottomColor: `rgba(0, 0, 0, ${progress * 0.1})`,
          boxShadow: progress > 0.3 ? `0 4px 20px rgba(0, 0, 0, ${progress * 0.08})` : "none",
          duration: 0.3,
          ease: "power2.out",
        })
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const textColorClass = isScrolled ? "text-black" : "text-white"
  const hoverBgClass = isScrolled ? "hover:bg-black/10" : "hover:bg-white/10"
  const borderColorClass = isScrolled ? "border-black" : "border-white"
  const logoBoxBgClass = isScrolled ? "bg-black" : "bg-white"
  const logoBoxTextClass = isScrolled ? "text-white" : "text-black"

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-50 border-b border-transparent transition-shadow duration-500"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-bold transition-colors duration-300 ${textColorClass} hover:opacity-70`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <div
              className={`w-8 h-8 flex items-center justify-center transition-colors duration-300 ${logoBoxBgClass}`}
            >
              <span className={`text-sm font-bold transition-colors duration-300 ${logoBoxTextClass}`}>P</span>
            </div>
            <span className={`font-bold text-lg tracking-wider transition-colors duration-300 ${textColorClass}`}>
              eru
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <Link
              href="#"
              className={`hidden sm:inline-block px-4 py-2 border text-xs font-bold rounded-full transition-all duration-300 ${borderColorClass} ${textColorClass} ${
                isScrolled ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black"
              }`}
            >
              RESERVATIONS
            </Link>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              aria-label="Cambiar idioma"
            >
              <Globe size={24} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              aria-label="Usuario"
            >
              <User size={24} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              aria-label="Buscar"
            >
              <Search size={24} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} relative flex items-center justify-center`}
              aria-label="Carrito"
            >
              <ShoppingCart size={24} className={`transition-colors duration-300 ${textColorClass}`} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>

            <button
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              {isMenuOpen ? (
                <X size={24} className={`transition-colors duration-300 ${textColorClass}`} />
              ) : (
                <Menu size={24} className={`transition-colors duration-300 ${textColorClass}`} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${textColorClass} hover:opacity-70`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
