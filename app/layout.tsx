import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Ride Circle - Self-Drive Car Rental Platform",
  description: "Professional car rental marketplace connecting car owners with renters across India",
  generator: "Ride Circle",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Navbar />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  )
}
