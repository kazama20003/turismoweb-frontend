"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Menu, X, Globe, Check } from "lucide-react"
import { CartDrawer } from "@/components/cart/cart-drawer"

const locales = ["es", "en", "pt"] as const
type Locale = (typeof locales)[number]
const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
}
const defaultLocale: Locale = "es"

const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale)
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  const currentLocaleFromPath = pathname.split("/")[1]
  const currentLocale: Locale = isValidLocale(currentLocaleFromPath) ? currentLocaleFromPath : defaultLocale

  const navItems = [
    { name: "Tours", href: `/${currentLocale}/tours` },
    { name: "Tienda", href: `/${currentLocale}/shop` },
    { name: "Visitar", href: `/${currentLocale}/visit` },
    { name: "Club", href: `/${currentLocale}/club` },
    { name: "Eventos", href: `/${currentLocale}/events` },
    { name: "Acerca de", href: `/${currentLocale}/about` },
  ]

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean)

    if (isValidLocale(segments[0])) {
      segments.shift()
    }

    const pathWithoutLocale = segments.length > 0 ? "/" + segments.join("/") : ""

    setIsLangMenuOpen(false)
    window.location.href = `/${newLocale}${pathWithoutLocale}`
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const textColorClass = isScrolled ? "text-foreground" : "text-white"
  const hoverBgClass = isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
  const borderColorClass = isScrolled ? "border-foreground" : "border-white"
  const logoBoxBgClass = isScrolled ? "bg-foreground" : "bg-white"
  const logoBoxTextClass = isScrolled ? "text-background" : "text-foreground"

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
      }`}
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

          <Link
            href={`/${currentLocale}`}
            className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center transition-colors duration-300 ${logoBoxBgClass}`}
            >
              <span className={`text-sm font-bold transition-colors duration-300 ${logoBoxTextClass}`}>P</span>
            </div>
            <span className={`font-bold text-lg tracking-wider transition-colors duration-300 ${textColorClass}`}>
              eru
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <Link
              href={`/${currentLocale}/reservations`}
              className={`hidden sm:inline-block px-4 py-2 border text-xs font-bold rounded-full transition-all duration-300 ${borderColorClass} ${textColorClass} ${
                isScrolled ? "hover:bg-foreground hover:text-background" : "hover:bg-white hover:text-foreground"
              }`}
            >
              Reservaciones
            </Link>

            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center gap-1`}
                aria-label="Idioma"
              >
                <Globe size={24} className={`transition-colors duration-300 ${textColorClass}`} />
                <span className={`text-xs font-bold uppercase ${textColorClass}`}>{currentLocale}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-background rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border">
                  <div className="max-h-80 overflow-y-auto">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted flex items-center justify-between transition-colors"
                      >
                        <span>{localeNames[loc]}</span>
                        {currentLocale === loc && <Check size={16} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

            <div className={textColorClass}>
              <CartDrawer />
            </div>

            <button
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
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

export default Header
