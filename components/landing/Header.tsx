'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-[#1e3a5f] text-lg tracking-tight">
          Andrade Real Estate
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-300 text-gray-600 hover:text-[#1e3a5f]"
          >
            MXN | USD
          </Button>

          {/* Hamburger */}
          <button
            className="md:hidden text-xl text-[#1e3a5f] leading-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {menuOpen ? 'X' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-[#1e3a5f] font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
