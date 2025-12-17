"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Menu, X, Globe, Check, ChevronDown } from "lucide-react"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useProfile } from "@/hooks/use-auth"
import { locales, localeNames, defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config"
import { getGlobalDictionary } from "@/lib/i18n/dictionaries/global"
import { gsap } from "gsap"

const IncaIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L4 7v5c0 5.25 3.5 10.15 8 11.5 4.5-1.35 8-6.25 8-11.5V7l-8-4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2" fill="currentColor" />
    <path d="M12 3v8M8 9l4-2 4 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuOverlayRef = useRef<HTMLDivElement>(null)

  const { data: user } = useProfile()

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
    if (mobileMenuOverlayRef.current && mobileMenuRef.current) {
      if (isMenuOpen) {
        // Prevenir scroll del body
        document.body.style.overflow = "hidden"

        // Animar el overlay (fondo negro)
        gsap.fromTo(mobileMenuOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })

        // Animar el menú deslizándose desde la izquierda
        gsap.fromTo(
          mobileMenuRef.current,
          { x: -300, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.1 },
        )
      } else {
        // Restaurar scroll del body
        document.body.style.overflow = ""
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const textColorClass = isScrolled ? "text-foreground" : "text-white"
  const hoverBgClass = isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
  const borderColorClass = isScrolled ? "border-foreground" : "border-white"

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile menu button */}
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

            {/* Desktop navigation */}
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

            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-2 sm:gap-2.5 absolute left-1/2 transform -translate-x-1/2"
            >
              <IncaIcon className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${textColorClass}`} />
              <span
                className={`font-bold text-lg sm:text-xl tracking-wide transition-colors duration-300 ${textColorClass}`}
              >
                PERÚ
              </span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              <Link
                href={`/${currentLocale}/users/profile`}
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
                    <div className="px-4 py-2.5 border-b border-black/5 bg-neutral-50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {dict.common.language}
                      </span>
                    </div>
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

              {user && (
                <Link
                  href={`/${currentLocale}/users/profile`}
                  className={`hidden sm:flex p-2 rounded-full transition-all duration-300 ${hoverBgClass} items-center justify-center`}
                  aria-label={dict.common.user}
                >
                  <User size={20} className={`transition-colors duration-300 ${textColorClass}`} />
                </Link>
              )}

              <button
                className={`p-2 rounded-full transition-all duration-300 ${hoverBgClass} flex items-center justify-center`}
                aria-label={dict.common.search}
              >
                <Search size={20} className={`transition-colors duration-300 ${textColorClass}`} />
              </button>

              <div className={textColorClass}>
                <CartDrawer />
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          ref={mobileMenuOverlayRef}
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            ref={mobileMenuRef}
            className="fixed top-14 sm:top-16 left-0 right-0 bottom-0 bg-black px-4 sm:px-6 pt-6 pb-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-4 text-base font-medium text-white hover:bg-white/10 transition-colors duration-300 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={`/${currentLocale}/users/profile`}
                className="px-4 py-4 text-base font-medium text-white hover:bg-white/10 transition-colors duration-300 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict.nav.reservations}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header
