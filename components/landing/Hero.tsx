'use client'

import Image from 'next/image'
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
    <section className="bg-[#18140D] relative md:overflow-visible overflow-hidden min-h-[92vh] flex flex-col">
      {/* Dot texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #D4B896 1px, transparent 0)',
        backgroundSize: '28px 28px'
      }} />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center" style={{ columnGap: '18rem' }}>

          {/* LEFT — copy */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[#B07030]" />
              <span className="text-[#B07030] text-xs tracking-[0.3em] uppercase font-medium">
                Inmobiliaria · México
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-white leading-[1.02] mb-6"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Tu próxima
              <br />
              <span className="text-[#B07030]">propiedad</span>
              <br />
              te espera.
            </h1>

            <p className="text-[#C8BCAE] text-base md:text-lg leading-relaxed max-w-md mb-10 font-normal">
              Compra, venta y renta de inmuebles en México con respaldo profesional y atención personalizada.
            </p>

            <form onSubmit={handleSearch} className="flex bg-[#F7F3EE] rounded-lg overflow-hidden max-w-md mb-8 shadow-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o ciudad..."
                className="flex-1 px-5 py-4 text-sm text-[#18140D] bg-transparent outline-none placeholder:text-[#A89880]"
              />
              <button
                type="submit"
                className="bg-[#B07030] hover:bg-[#9A6028] text-white text-sm font-semibold px-7 py-4 transition-colors tracking-wide shrink-0"
              >
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                href="/propiedades"
                className="text-white border border-[#3A3028] hover:border-[#8C7B68] rounded-full px-6 py-2.5 text-sm font-medium transition-colors tracking-wide"
              >
                Ver catálogo completo
              </Link>
              <Link
                href="/#contacto"
                className="text-[#D4C8B8] hover:text-white text-sm transition-colors underline underline-offset-4"
              >
                Contáctanos
              </Link>
            </div>
          </div>

          {/* RIGHT — circular property image */}
          <div className="hidden md:flex justify-center items-center self-center">
            <div className="relative" style={{ width: 520, height: 520, minWidth: 520, minHeight: 520 }}>
              {/* Single thick gold ring */}
              <div className="absolute inset-0 rounded-full" style={{ border: '3px solid rgba(176,112,48,0.6)' }} />
              {/* Image circle */}
              <div className="absolute inset-[6px] rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90"
                  alt="Propiedad"
                  fill
                  className="object-cover"
                  sizes="508px"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="h-12 bg-gradient-to-b from-transparent to-[#F7F3EE]" />
    </section>
  )
}
