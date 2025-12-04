import type React from "react"
import { Footer } from "@/components/home/footer"
import Header from "@/components/home/header"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
