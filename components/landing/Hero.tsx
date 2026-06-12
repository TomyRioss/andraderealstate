'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type HeroProperty = {
  id: string
  title: string
  photos: string[]
  priceMXN: number | null
  city: string
  state: string
  slug: string
}

function fmtPrice(priceMXN: number | null): string | null {
  if (!priceMXN) return null
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(priceMXN)
}

export default function Hero({ properties = [] }: { properties?: HeroProperty[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)

  const goTo = (idx: number) => {
    if (idx === current) return
    setNext(idx)
    setTimeout(() => { setCurrent(idx); setNext(null) }, 700)
  }

  useEffect(() => {
    if (properties.length === 0) return
    const interval = setInterval(() => goTo((current + 1) % properties.length), 5000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/propiedades?search=${encodeURIComponent(trimmed)}` : '/propiedades')
  }

  return (
    <section className="bg-[#0D3B66] relative overflow-hidden min-h-[92vh] flex flex-col">
      {/* Dot texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #AED6F1 1px, transparent 0)',
        backgroundSize: '28px 28px'
      }} />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-28 flex-1 flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-center gap-12 xl:gap-16">

          {/* LEFT */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#1A5F9E] shrink-0" />
              <span className="text-[#AED6F1] text-xs tracking-[0.3em] uppercase font-medium">
                Inmobiliaria · México
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-5"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Tu próxima
              <br />
              <span className="text-[#AED6F1]">propiedad</span>
              <br />
              te espera.
            </h1>

            <p className="text-[#AED6F1] text-base leading-relaxed max-w-sm mb-8">
              Compra, venta y renta de inmuebles en México con respaldo profesional y atención personalizada.
            </p>

            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden max-w-sm mb-7 shadow-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o ciudad..."
                className="flex-1 min-w-0 px-4 py-3.5 text-sm text-[#1A5F9E] bg-transparent outline-none placeholder:text-[#4A7BA7]"
              />
              <button
                type="submit"
                className="bg-[#1A5F9E] hover:bg-[#0D3B66] text-white text-sm font-bold px-5 py-3.5 transition-colors tracking-wide shrink-0 m-1 rounded-lg"
              >
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap gap-5 items-center">
              <Link
                href="/propiedades"
                className="text-white border border-[#AED6F1]/50 hover:border-[#AED6F1] rounded-full px-5 py-2 text-sm font-medium transition-colors"
              >
                Ver catálogo completo
              </Link>
              <Link
                href="/#contacto"
                className="text-[#AED6F1] hover:text-white text-sm transition-colors underline underline-offset-4"
              >
                Contáctanos
              </Link>
            </div>
          </div>

          {/* RIGHT — vertical peek carousel */}
          <div className="hidden lg:flex flex-1 min-w-0 w-full items-center justify-center">
            {properties.length === 0 ? (
              <div
                className="flex justify-center items-center rounded-2xl w-full"
                style={{ height: 500, border: '1.5px solid rgba(174,214,241,0.3)', background: 'rgba(26,95,158,0.08)' }}
              >
                <div className="text-center px-8">
                  <div className="text-5xl mb-4">🏗️</div>
                  <p className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
                    ¡Pronto nuevos proyectos inmobiliarios!
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full overflow-hidden" style={{ height: 500 }}>
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 80, background: 'linear-gradient(to bottom, #0D3B66 0%, transparent 100%)' }} />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 80, background: 'linear-gradient(to top, #0D3B66 0%, transparent 100%)' }} />
                {properties.map((prop, i) => {
                  let offset = i - current
                  const half = properties.length / 2
                  if (offset > half) offset -= properties.length
                  if (offset < -half) offset += properties.length
                  const CARD_H = 380
                  const GAP = 12
                  const centerY = (500 - CARD_H) / 2
                  const translateY = centerY + offset * (CARD_H + GAP)
                  const isActive = offset === 0
                  const isAdjacent = Math.abs(offset) === 1
                  const isVisible = Math.abs(offset) <= 1

                  if (!isVisible) return null

                  return (
                    <div
                      key={prop.id}
                      onClick={() => !isActive && goTo(i)}
                      className="absolute left-0 right-0 rounded-2xl overflow-hidden"
                      style={{
                        height: CARD_H,
                        top: translateY,
                        transition: 'top 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease, transform 0.55s ease',
                        opacity: isActive ? 1 : 0.4,
                        transform: isAdjacent ? 'scaleX(0.94)' : 'scaleX(1)',
                        transformOrigin: 'center',
                        cursor: isActive ? 'default' : 'pointer',
                        border: '1.5px solid rgba(174,214,241,0.25)',
                      }}
                    >
                      <Image
                        src={prop.photos[0]}
                        alt={prop.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:1280px) 50vw, 580px"
                        priority={i === 0}
                      />
                      {/* Gradient */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,59,102,0.88) 0%, rgba(13,59,102,0.35) 45%, transparent 70%)' }} />
                      {/* Info — only on active */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 px-7 pb-7">
                          <p className="text-[#AED6F1] text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {prop.city}, {prop.state}
                          </p>
                          <h3 className="text-white text-xl font-semibold mb-1 leading-snug" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
                            {prop.title}
                          </h3>
                          {fmtPrice(prop.priceMXN) && (
                            <p className="text-white text-2xl font-bold tracking-tight mb-4">
                              {fmtPrice(prop.priceMXN)}
                            </p>
                          )}
                          <Link
                            href={`/propiedades/${prop.slug}`}
                            className="inline-flex items-center gap-2 bg-[#1A5F9E] hover:bg-[#0D3B66] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Dots */}
                {properties.length > 1 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                    {properties.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{ background: i === current ? '#AED6F1' : 'rgba(174,214,241,0.35)' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="h-12 bg-gradient-to-b from-transparent to-white" />
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </section>
  )
}
