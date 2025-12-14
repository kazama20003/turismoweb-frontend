"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Menu, X, Globe, Check, ChevronDown } from "lucide-react"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { locales, localeNames, defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config"
import { getGlobalDictionary } from "@/lib/i18n/dictionaries/global"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  const currentLocaleFromPath = pathname.split("/")[1]
  const currentLocale: Locale = isValidLocale(currentLocaleFromPath) ? currentLocaleFromPath : defaultLocale

  const dict = getGlobalDictionary(currentLocale)

  const navItems = [
    { name: dict.nav.tours, href: `/${currentLocale}/tours` },
    { name: dict.nav.transports, href: `/${currentLocale}/transports` },
    { name: dict.nav.visit, href: `/${currentLocale}/visit` },
    { name: dict.nav.club, href: `/${currentLocale}/club` },
    { name: dict.nav.events, href: `/${currentLocale}/events` },
    { name: dict.nav.about, href: `/${currentLocale}/about` },
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

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

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
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile menu button - moved to left on mobile */}
          <button
            className={`lg:hidden p-2 -ml-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={dict.common.menu}
          >
            {isMenuOpen ? (
              <X size={22} className={`transition-colors duration-300 ${textColorClass}`} />
            ) : (
              <Menu size={22} className={`transition-colors duration-300 ${textColorClass}`} />
            )}
          </button>

          {/* Desktop navigation - hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[10px] xl:text-xs font-bold transition-colors duration-300 ${textColorClass} hover:opacity-70 whitespace-nowrap`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logo - centered */}
          <Link
            href={`/${currentLocale}`}
            className="flex items-center gap-1.5 sm:gap-2 absolute left-1/2 transform -translate-x-1/2"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors duration-300 ${logoBoxBgClass}`}
            >
              <span className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${logoBoxTextClass}`}>
                P
              </span>
            </div>
            <span
              className={`font-bold text-base sm:text-lg tracking-wider transition-colors duration-300 ${textColorClass}`}
            >
              eru
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Reservations button - hidden on mobile */}
            <Link
              href={`/${currentLocale}/reservations`}
              className={`hidden md:inline-block px-3 lg:px-4 py-1.5 lg:py-2 border text-[10px] lg:text-xs font-bold rounded-full transition-all duration-300 ${borderColorClass} ${textColorClass} ${
                isScrolled ? "hover:bg-foreground hover:text-background" : "hover:bg-white hover:text-foreground"
              }`}
            >
              {dict.nav.reservations}
            </Link>

            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${hoverBgClass} ${
                  isLangMenuOpen ? (isScrolled ? "bg-muted" : "bg-white/10") : ""
                }`}
                aria-label={dict.common.language}
              >
                <Globe size={18} className={`transition-colors duration-300 ${textColorClass}`} />
                <span className={`text-[10px] sm:text-xs font-bold uppercase ${textColorClass} hidden sm:inline`}>
                  {currentLocale}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-all duration-300 ${textColorClass} ${isLangMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-black/5">
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-black/5 bg-neutral-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {dict.common.language}
                    </span>
                  </div>
                  {/* Language list */}
                  <div className="max-h-72 overflow-y-auto py-1">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                          currentLocale === loc
                            ? "bg-neutral-100 text-black font-medium"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{localeNames[loc]}</span>
                        {currentLocale === loc && <Check size={16} className="text-black" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User button - hidden on small mobile */}
            <button
              className={`hidden sm:flex p-2 rounded-full transition-all duration-300 ${hoverBgClass} items-center justify-center`}
              aria-label={dict.common.user}
            >
              <User size={20} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            {/* Search button */}
            <button
              className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
              aria-label={dict.common.search}
            >
              <Search size={20} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>

            {/* Cart */}
            <div className={textColorClass}>
              <CartDrawer />
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            className={`lg:hidden pb-4 pt-2 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300 border-t ${isScrolled ? "border-border" : "border-white/20"}`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-lg ${textColorClass} ${hoverBgClass}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Reservations in mobile menu */}
            <Link
              href={`/${currentLocale}/reservations`}
              className={`px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-lg ${textColorClass} ${hoverBgClass}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dict.nav.reservations}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
