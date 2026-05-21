'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/lib/contexts/CurrencyContext'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { currency, toggle } = useCurrency()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-black text-[#1e3a5f] text-xl tracking-widest">ANDRADE</span>
          <span className="font-light text-[#1e3a5f] text-sm tracking-wide">Real Estate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#374151] hover:text-[#1e3a5f] border-b-2 border-transparent hover:border-[#10b981] pb-0.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-full border border-[#1e3a5f] text-[#1e3a5f] text-xs px-4 py-1.5 font-semibold hover:bg-[#1e3a5f] hover:text-white transition-colors"
          >
            {currency === 'MXN' ? 'MXN' : 'USD'}
          </button>

          <button
            className="md:hidden text-[#1e3a5f] text-xl leading-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e7eb] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#374151] hover:text-[#1e3a5f] transition-colors"
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
