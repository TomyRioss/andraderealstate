'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/propiedades?search=${encodeURIComponent(trimmed)}` : '/propiedades')
  }

  return (
    <section className="min-h-[75vh] bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[#10b981] font-semibold text-xs tracking-[0.2em] uppercase mb-4">
          Inmobiliaria en México
        </p>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          Tu próxima propiedad está aquí
        </h1>

        <p className="text-white/70 text-lg max-w-xl mx-auto mt-4">
          Compra, venta y renta de inmuebles en México con respaldo profesional
        </p>

        <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto flex bg-white rounded-xl overflow-hidden shadow-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o ciudad..."
            className="flex-1 px-6 py-4 text-sm text-gray-800 outline-none border-none bg-transparent placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-[#10b981] hover:bg-[#0d9e6e] text-white font-bold px-8 py-4 text-sm tracking-wide transition-colors rounded-none"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            href="/propiedades"
            className="border border-white/40 text-white hover:bg-white/10 rounded-full px-6 py-2 text-sm font-medium transition"
          >
            Ver propiedades
          </Link>
          <Link
            href="/contacto"
            className="text-white/60 hover:text-white text-sm underline underline-offset-4 transition flex items-center justify-center"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  )
}
