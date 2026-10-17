'use client'

import { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCurrency } from '@/lib/contexts/CurrencyContext'

interface NavChild {
  label: string
  href: string
  external?: boolean
  target?: '_blank'
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

function getNavItems(): NavItem[] {
  return [
    { label: 'Inicio', href: '/' },
    {
      label: 'Propiedades',
      href: '/propiedades',
      children: [
        { label: 'Renta', href: '/vender' },
        { label: 'Venta', href: '/comprar' },
        { label: 'Estancias vacacionales', href: '/propiedades?category=VACATION_STAY' },
        { label: 'Administrar', href: '/administrar' },
      ],
    },
    {
      label: 'Desarrollos',
      href: '/propiedades?contractType=DEVELOPMENT',
    },
    {
      label: 'Contacto',
      href: '/contacto',
      children: [
        {
          label: 'WhatsApp',
          href: 'https://api.whatsapp.com/message/52PNLUOHBGDLH1?autoload=1&app_absent=0',
          external: true,
          target: '_blank',
        },
        { label: 'Email', href: 'mailto:rentasysolucionnes@gmail.com', external: true },
        { label: 'Reseñas', href: '/testimonios' },
      ],
    },
  ]
}

function Chevron({ expanded = false }: { expanded?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mb-1 inline-block h-2 w-2 rotate-45 border-b border-r border-current transition-transform ${expanded ? 'rotate-[225deg]' : ''}`}
    />
  )
}

function NavChildLink({
  child,
  className,
  onClick,
}: {
  child: NavChild
  className: string
  onClick: () => void
}) {
  if (child.external) {
    return (
      <a
        href={child.href}
        target={child.target}
        rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onClick}
      >
        {child.label}
      </a>
    )
  }

  return (
    <Link href={child.href} className={className} onClick={onClick}>
      {child.label}
    </Link>
  )
}

function subscribeToScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

function subscribeToNothing() {
  return () => {}
}

function getScrollSnapshot() {
  return window.scrollY > 36
}

function getUnscrolledSnapshot() {
  return false
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { currency, toggle } = useCurrency()
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isScrolled = useSyncExternalStore(
    isLandingPage ? subscribeToScroll : subscribeToNothing,
    isLandingPage ? getScrollSnapshot : getUnscrolledSnapshot,
    getUnscrolledSnapshot,
  )
  const navItems = getNavItems()


  return (
    <header
      className={`sticky top-0 z-50 border-b text-white transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out motion-reduce:transition-none ${
        isLandingPage
          ? isScrolled
            ? 'border-[#B3B3B3]/40 bg-[#0D1A2D]/95 shadow-sm backdrop-blur-sm'
            : 'border-transparent bg-transparent shadow-none'
          : 'border-[#B3B3B3] bg-[#0D1A2D]'
      } ${isLandingPage ? '-mb-20 md:-mb-[88px]' : ''}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-3">
        <Link
          href="/"
          aria-label="Andrade & Co Real Estate, inicio"
          className="flex h-14 w-32 shrink-0 items-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3] md:h-16 md:w-52"
        >
          <Image
            src="/andrade_realstate_logo.png"
            alt="Andrade & Co Real Estate"
            width={240}
            height={160}
            className="h-auto w-32 -translate-y-3 md:w-52 md:translate-y-0"
            priority
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="group relative flex items-center gap-1"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="py-3 text-sm font-medium text-white transition-colors hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
              >
                {item.label}
              </Link>
              {item.children && (
                <button
                  type="button"
                  aria-label={`${openDropdown === item.label ? 'Cerrar' : 'Abrir'} opciones de ${item.label}`}
                  aria-expanded={openDropdown === item.label}
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className="flex h-9 w-6 items-center justify-center text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
                >
                  <Chevron expanded={openDropdown === item.label} />
                </button>
              )}

              {item.children && openDropdown === item.label && (
                <div className="absolute left-0 top-full z-50 max-h-[70vh] w-52 overflow-y-auto border border-[#B3B3B3]/70 bg-[#0D1A2D] py-1 shadow-[0_8px_24px_rgba(13,26,45,0.24)]">
                  <div className="divide-y divide-[#B3B3B3]/30">
                    {item.children.map((child) => (
                      <NavChildLink
                        key={child.href}
                        child={child}
                        className="block px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:bg-[#B3B3B3] focus-visible:text-[#0D1A2D] focus-visible:outline-none"
                        onClick={() => setOpenDropdown(null)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Moneda</span>
            <button
              type="button"
              onClick={toggle}
              aria-label={`Cambiar moneda. Actual: ${currency}`}
              aria-pressed={currency === 'USD'}
              className="flex min-h-9 items-center border border-[#B3B3B3] p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
            >
              <span className={`px-2.5 py-1 text-xs font-semibold transition-colors ${currency === 'MXN' ? 'bg-[#B3B3B3] text-[#0D1A2D]' : 'text-white'}`}>
                MXN
              </span>
              <span className={`px-2.5 py-1 text-xs font-semibold transition-colors ${currency === 'USD' ? 'bg-[#B3B3B3] text-[#0D1A2D]' : 'text-white'}`}>
                USD
              </span>
            </button>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3] lg:hidden"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <span className={`h-px w-5 bg-current transition-transform ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            {!menuOpen && <span className="h-px w-5 bg-current" />}
            <span className={`h-px w-5 bg-current transition-transform ${menuOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Navegación móvil" className="border-t border-[#B3B3B3] bg-[#0D1A2D] px-6 py-4 lg:hidden">
          {navItems.map((item) => (
            <div key={item.href} className="border-b border-[#B3B3B3]/50 last:border-b-0">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="py-3 text-base font-medium text-white transition-colors hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    aria-label={`${openDropdown === item.label ? 'Cerrar' : 'Abrir'} opciones de ${item.label}`}
                    aria-expanded={openDropdown === item.label}
                    className="flex h-11 w-11 items-center justify-center text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
                  >
                    <Chevron expanded={openDropdown === item.label} />
                  </button>
                )}
              </div>
              {item.children && openDropdown === item.label && (
                <div className="mb-3 ml-2 max-h-[50vh] overflow-y-auto border-l border-[#B3B3B3] pl-4">
                  <div className="divide-y divide-[#B3B3B3]/30">
                    {item.children.map((child) => (
                      <NavChildLink
                        key={child.href}
                        child={child}
                        className="block py-3 text-sm text-[#B3B3B3] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
                        onClick={() => { setMenuOpen(false); setOpenDropdown(null) }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
