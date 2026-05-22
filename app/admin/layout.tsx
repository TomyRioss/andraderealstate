'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/propiedades',
    label: 'Propiedades',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/testimonios',
    label: 'Testimonios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut({ redirectTo: '/admin/login' })
  }

  const isLogin = pathname === '/admin/login'
  if (isLogin) return <>{children}</>

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F0EA' }}>
      {/* Mobile topbar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4"
        style={{ backgroundColor: '#18140D' }}
      >
        <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#C9A96E' }}>
          Andrade & Co
        </span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="transition-opacity hover:opacity-70"
          style={{ color: '#A89880' }}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 w-64 flex-shrink-0 flex flex-col
          transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ backgroundColor: '#18140D', minHeight: '100vh' }}
      >
        {/* Brand */}
        <div className="px-7 pt-8 pb-6 border-b flex flex-col items-center" style={{ borderColor: '#2E2820' }}>
          <Image
            src="/andrade_realstate_logo.png"
            alt="Andrade & Co"
            width={140}
            height={60}
            className="brightness-[1.6]"
          />
          <p className="mt-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: '#A89880' }}>
            Panel de administración
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group hover:bg-[rgba(201,169,110,0.06)] hover:text-[#C9A96E]"
                style={{
                  color: active ? '#C9A96E' : '#B0A090',
                  backgroundColor: active ? 'rgba(201,169,110,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #C9A96E' : '2px solid transparent',
                }}
              >
                <span className="transition-colors duration-150 group-hover:text-[#C9A96E]" style={{ color: active ? '#C9A96E' : '#8C7B68' }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8 border-t pt-4" style={{ borderColor: '#2E2820' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-red-950/30"
            style={{ color: '#5C4F42' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 min-h-screen pt-16 md:pt-0 overflow-auto">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
