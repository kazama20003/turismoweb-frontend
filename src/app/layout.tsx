import type React from "react"
import "./globals.css"
export const metadata = {
  title: "Tourism & Transport Dashboard",
  description: "Manage your tourism and transportation services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <>
    {children}
    </>
  )
}
