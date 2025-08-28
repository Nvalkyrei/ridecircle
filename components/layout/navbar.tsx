"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/ride-circle-logo.png" alt="Ride Circle" width={36} height={36} className="w-9 h-9" />
            <span className="text-xl font-bold text-white">Ride Circle</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-slate-300 hover:text-white font-medium transition-colors">
              How it works
            </Link>
            <Link href="/support" className="text-slate-300 hover:text-white font-medium transition-colors">
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5 text-slate-300" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-slate-300 hover:text-white font-medium px-4 py-2">
                How it works
              </Link>
              <Link href="/support" className="text-slate-300 hover:text-white font-medium px-4 py-2">
                Support
              </Link>
              <Link href="/profile" className="text-slate-300 hover:text-white font-medium px-4 py-2">
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
