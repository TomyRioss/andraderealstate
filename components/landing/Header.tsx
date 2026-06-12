'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from '@/lib/contexts/CurrencyContext'

interface NavChild { label: string; href: string }
interface NavItem { label: string; href: string; children?: NavChild[] }

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Venta',
    href: '/propiedades/venta',
    children: [
      { label: 'Casas', href: '/propiedades/venta/casas' },
      { label: 'Departamentos', href: '/propiedades/venta/departamentos' },
      { label: 'Terrenos', href: '/propiedades/venta/terrenos' },
    ],
  },
  {
    label: 'Renta',
    href: '/propiedades/renta',
    children: [
      { label: 'Casas', href: '/propiedades/renta/casas' },
      { label: 'Departamentos', href: '/propiedades/renta/departamentos' },
      { label: 'Oficinas', href: '/propiedades/renta/oficinas' },
    ],
  },
  { label: 'Desarrollos', href: '/propiedades/desarrollos' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { currency, toggle } = useCurrency()

  return (
    <header className="sticky top-0 z-50 bg-[#0D3B66]/95 backdrop-blur-sm border-b border-[#AED6F1]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/andrade_realstate_logo.png"
            alt="Andrade & Co Real Estate"
            width={240}
            height={64}
            className="h-16"
            style={{ filter: 'brightness(0) invert(1)', width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative group"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 text-base font-normal text-white hover:text-[#AED6F1] hover:underline underline-offset-4 transition-colors tracking-wide py-1"
              >
                {item.label}
                {item.children && (
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>

              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 w-44 pt-2 z-50">
                <div className="bg-[#0D3B66] border border-[#AED6F1]/20 rounded-lg shadow-xl py-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-[#AED6F1] hover:text-white hover:bg-[#1A5F9E] transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Currency toggle */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#AED6F1] font-semibold">Moneda</span>
            <button
              onClick={toggle}
              className="flex items-center rounded-full border border-[#AED6F1]/40 bg-[#0D3B66] p-0.5"
              aria-label="Cambiar moneda"
            >
              <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-widest transition-all ${
                currency === 'MXN' ? 'bg-[#1A5F9E] text-white' : 'text-[#AED6F1]/60 hover:text-[#AED6F1]'
              }`}>MXN</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-widest transition-all ${
                currency === 'USD' ? 'bg-[#1A5F9E] text-white' : 'text-[#AED6F1]/60 hover:text-[#AED6F1]'
              }`}>USD</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white leading-none p-1"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l16 16M17 1L1 17"/></svg>
            ) : (
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M0 1h20M0 7h20M0 13h20"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D3B66] border-t border-[#AED6F1]/20 px-6 py-5 flex flex-col gap-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="py-2.5 text-base font-normal text-white hover:text-[#AED6F1] transition-colors tracking-wide"
                  onClick={() => { if (!item.children) setMenuOpen(false) }}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="text-[#AED6F1]/50 hover:text-white p-2 transition-colors"
                  >
                    <svg
                      width="10" height="6" viewBox="0 0 10 6" fill="none"
                      className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
              {item.children && openDropdown === item.label && (
                <div className="pl-4 pb-2 flex flex-col gap-0.5 border-l border-[#AED6F1]/20 ml-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="py-2 text-sm text-[#AED6F1] hover:text-white transition-colors"
                      onClick={() => { setMenuOpen(false); setOpenDropdown(null) }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
