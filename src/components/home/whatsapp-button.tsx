"use client"

import { MessageCircle } from "lucide-react"

interface WhatsappButtonProps {
  phoneNumber?: string
  productName: string
  className?: string
}

export function WhatsappButton({ phoneNumber = "51206784", productName, className = "" }: WhatsappButtonProps) {
  const message = encodeURIComponent(`Hola, quisiera reservar: ${productName}`)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium tracking-widest uppercase transition-colors ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      Reservar por WhatsApp
    </a>
  )
}
