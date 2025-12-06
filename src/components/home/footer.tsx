"use client"

import { Instagram, Facebook, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n/config"
import { getFooterDictionary } from "@/lib/i18n/dictionaries/footer"

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const dict = getFooterDictionary(locale)

  return (
    <footer className="bg-[#fff] text-[#1a1a1a]">
      <div className="w-full h-px bg-black/25" />

      <div className="px-6 md:px-12 pt-12 pb-6">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Logo */}
          <div className="shrink-0">
            <svg
              width="60"
              height="80"
              viewBox="0 0 60 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#1a1a1a]"
            >
              <path d="M30 0L0 15V55L30 80L60 55V15L30 0ZM30 5L55 18V52L30 73L5 52V18L30 5Z" fill="currentColor" />
              <path d="M15 25L30 15L45 25V45L30 55L15 45V25Z" fill="currentColor" />
              <path
                d="M30 20L20 27V43L30 50L40 43V27L30 20ZM30 25L37 30V40L30 45L23 40V30L30 25Z"
                fill="currentColor"
              />
              <path d="M25 32L30 28L35 32V38L30 42L25 38V32Z" fill="currentColor" />
            </svg>
          </div>

          {/* Subscribe + Navigation */}
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            {/* Subscribe */}
            <div className="flex flex-col gap-4">
              <span className="text-sm tracking-wide">{dict.subscribe}</span>
              <div className="flex items-center gap-2 border-b border-black/25 pb-2">
                <input
                  type="email"
                  placeholder={dict.email}
                  className="bg-transparent text-sm placeholder:text-[#1a1a1a]/50 focus:outline-none w-48"
                />
                <button className="p-1 rounded-full border border-black/25 hover:bg-[#1a1a1a]/10 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Navigation columns */}
            <div className="flex gap-16 md:gap-24">
              <nav className="flex flex-col gap-3">
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.restaurant}
                </Link>
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.careers}
                </Link>
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.trade}
                </Link>
              </nav>
              <nav className="flex flex-col gap-3">
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.story}
                </Link>
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.sustainability}
                </Link>
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.news}
                </Link>
                <Link href="#" className="text-sm hover:opacity-70 transition-opacity">
                  {dict.contact}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Middle section - Address, MAXWELL-MADE, Socials */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12">
          {/* Address */}
          <div className="text-xs leading-relaxed italic text-[#1a1a1a]/80">
            <p>{dict.address}</p>
            <p>{dict.country}</p>
            <p>
              {dict.phone} <span className="not-italic">+61 8 8323 8200</span>
            </p>
          </div>

          {/* MAXWELL-MADE */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1a1a1a]">{dict.brand}</h2>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <Link href="#" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Bottom section - Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-black/25">
          <p className="text-[10px] leading-relaxed text-[#1a1a1a]/70 max-w-3xl">
            {dict.copyright} &nbsp;&nbsp; {dict.license}
          </p>
          <div className="flex items-center gap-6 text-[10px] text-[#1a1a1a]/70">
            <Link href="#" className="hover:text-[#1a1a1a] transition-colors">
              {dict.privacy}
            </Link>
            <Link href="#" className="hover:text-[#1a1a1a] transition-colors">
              {dict.terms}
            </Link>
            <Link href="#" className="hover:text-[#1a1a1a] transition-colors">
              {dict.shipping}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
