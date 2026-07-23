'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

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
    href: '/admin/categorias',
    label: 'Categorías',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/admin/usuarios',
    label: 'Usuarios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
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

  const adminVars = {
    '--background': '#FAF7EF',
    '--foreground': '#2A2410',
    '--card': '#FFFFFF',
    '--card-foreground': '#2A2410',
    '--muted': '#F0EBDA',
    '--muted-foreground': '#8A7A50',
    '--border': '#E3D9B8',
    '--primary': '#B8912A',
    '--primary-foreground': '#FFFFFF',
    '--secondary': '#B8912A',
    '--secondary-foreground': '#FFFFFF',
  } as React.CSSProperties

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F0EBDA', ...adminVars }}>
      {/* Mobile topbar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E3D9B8' }}
      >
        <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#B8912A' }}>
          Grupo Chalita
        </span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="transition-opacity hover:opacity-70"
          style={{ color: '#B8912A' }}
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
        style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', borderRight: '1px solid #E3D9B8' }}
      >
        {/* Brand */}
        <div className="px-7 pt-8 pb-6 border-b flex flex-col items-center" style={{ borderColor: '#E3D9B8' }}>
          <span className="text-lg font-semibold tracking-wide" style={{ color: '#B8912A' }}>Grupo Chalita</span>
          <p className="mt-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: '#B8912A' }}>
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group hover:bg-[rgba(184,145,42,0.08)] hover:text-[#B8912A]"
                style={{
                  color: active ? '#B8912A' : '#4A4020',
                  backgroundColor: active ? 'rgba(184,145,42,0.1)' : 'transparent',
                  borderLeft: active ? '2px solid #B8912A' : '2px solid transparent',
                }}
              >
                <span className="transition-colors duration-150 group-hover:text-[#B8912A]" style={{ color: active ? '#B8912A' : '#8A7A50' }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8 border-t pt-4" style={{ borderColor: '#E3D9B8' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-red-50"
            style={{ color: '#2A2410' }}
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
      <main className="flex-1 min-h-screen pt-16 md:pt-0">
        <div className="w-full px-6 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
