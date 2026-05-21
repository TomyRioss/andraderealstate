'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/propiedades?search=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/propiedades')
    }
  }

  return (
    <section
      className="min-h-[70vh] flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Tu próxima propiedad está aquí
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto">
          Compra, venta y renta de inmuebles en México
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 mt-4 max-w-xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o ciudad..."
            className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#10b981] hover:bg-[#0d9e6e] text-white font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Buscar
          </button>
        </form>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/propiedades">
            <Button className="bg-[#10b981] hover:bg-[#0d9e6e] text-white font-semibold px-6 py-3 rounded-lg w-full sm:w-auto">
              Ver propiedades
            </Button>
          </Link>
          <Link href="/contacto">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg w-full sm:w-auto bg-transparent"
            >
              Contáctanos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
