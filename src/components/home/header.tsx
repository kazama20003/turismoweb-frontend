"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search, User, Menu, X, Globe, Check } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { locales, localeNames, type Locale, isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"

gsap.registerPlugin(ScrollTrigger)

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  const currentLocaleFromPath = pathname.split("/")[1]
  const currentLocale: Locale = isValidLocale(currentLocaleFromPath) ? currentLocaleFromPath : defaultLocale

  const dictionary = useMemo(() => getDictionary(currentLocale), [currentLocale])

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: unknown = dictionary

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  const navItems = [
    { name: t("nav.tours"), href: `/${currentLocale}/tours` },
    { name: t("nav.shop"), href: `/${currentLocale}/shop` },
    { name: t("nav.visit"), href: `/${currentLocale}/visit` },
    { name: t("nav.club"), href: `/${currentLocale}/club` },
    { name: t("nav.events"), href: `/${currentLocale}/events` },
    { name: t("nav.about"), href: `/${currentLocale}/about` },
  ]

  const switchLocale = (newLocale: Locale) => {
    // Split pathname into segments and filter out empty strings
    const segments = pathname.split("/").filter(Boolean)

    // Remove the first segment if it's a valid locale
    if (isValidLocale(segments[0])) {
      segments.shift()
    }

    // Rebuild path without locale
    const pathWithoutLocale = segments.length > 0 ? "/" + segments.join("/") : ""

    // Close menu first
    setIsLangMenuOpen(false)

    window.location.href = `/${newLocale}${pathWithoutLocale}`
  }

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
                isScrolled ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black"
              }`}
            >
              {t("nav.reservations")}
            </Link>

            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center gap-1`}
                aria-label={t("common.language")}
              >
                <Globe size={24} className={`transition-colors duration-300 ${textColorClass}`} />
                <span className={`text-xs font-bold uppercase ${textColorClass}`}>{currentLocale}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-80 overflow-y-auto">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-black hover:bg-black/5 flex items-center justify-between transition-colors"
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
              aria-label={t("common.user")}
            >
              <User size={24} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              aria-label={t("common.search")}
            >
              <Search size={24} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} relative flex items-center justify-center`}
              aria-label={t("common.cart")}
            >
              <ShoppingCart size={24} className={`transition-colors duration-300 ${textColorClass}`} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>

            <button
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t("common.menu")}
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
