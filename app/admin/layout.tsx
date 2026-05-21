'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/propiedades', label: 'Propiedades' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/testimonios', label: 'Testimonios' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between bg-[#0f172a] px-4 py-3">
        <span className="text-white font-semibold text-lg">Admin</span>
        <button
          className="text-white text-2xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#0f172a] w-full md:w-56 flex-shrink-0 flex flex-col md:min-h-screen
          ${menuOpen ? 'block' : 'hidden'} md:flex`}
      >
        <div className="hidden md:flex items-center px-6 py-6">
          <span className="text-white font-bold text-xl tracking-tight">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-4 md:pb-0 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname.startsWith(link.href)
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4">
          <Button
            variant="ghost"
            className="w-full text-slate-300 hover:text-white hover:bg-red-800/40 justify-start"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-slate-50 min-h-screen p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
