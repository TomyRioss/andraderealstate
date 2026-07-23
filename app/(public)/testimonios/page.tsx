'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types'

type SortKey = 'recent' | 'oldest' | 'highest' | 'lowest'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  if (years >= 1) return `hace ${years} año${years > 1 ? 's' : ''}`
  if (months >= 1) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  if (days >= 1) return `hace ${days} día${days > 1 ? 's' : ''}`
  if (hours >= 1) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  return `hace ${mins} minuto${mins !== 1 ? 's' : ''}`
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < rating ? '#D4AF6B' : '#DCDCE6'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Más recientes' },
  { key: 'oldest', label: 'Más antiguas' },
  { key: 'highest', label: 'Mayor puntuación' },
  { key: 'lowest', label: 'Menor puntuación' },
]

function sortTestimonials(list: Testimonial[], key: SortKey): Testimonial[] {
  return [...list].sort((a, b) => {
    if (key === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (key === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (key === 'highest') return b.rating - a.rating
    if (key === 'lowest') return a.rating - b.rating
    return 0
  })
}

export default function TestimoniosPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>('recent')

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => setTestimonials(data?.data ?? data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const sorted = sortTestimonials(testimonials, sort)
  const avg = testimonials.length > 0
    ? Math.round((testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length) * 10) / 10
    : 0

  return (
    <main className="min-h-screen py-16 px-6" style={{ backgroundColor: '#F5F2EE' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#D4AF6B]" />
            <span className="text-[#D4AF6B] text-xs tracking-[0.25em] uppercase font-semibold">Reseñas verificadas</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl text-[#F5EDD8]" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
              Todas las reseñas
            </h1>
            {testimonials.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#F5EDD8]">{avg}</span>
                <div>
                  <StarRating rating={Math.round(avg)} />
                  <p className="text-xs text-[#7A6845] mt-1">{testimonials.length} reseña{testimonials.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className="px-4 py-2 text-xs font-semibold rounded-full transition-colors"
              style={{
                backgroundColor: sort === opt.key ? '#111009' : '#1A1810',
                color: sort === opt.key ? '#D4AF6B' : '#111009',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-sm text-[#7A6845]">Cargando reseñas...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-sm text-[#7A6845]">No hay reseñas aún.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((t) => {
              const initials = t.author.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
              return (
                <div key={t.id} className="bg-[#1A1810] rounded-xl p-6 flex flex-col gap-4" style={{ border: '1px solid #2E2A18' }}>
                  <div className="flex items-center justify-between">
                    <StarRating rating={Math.max(0, Math.min(5, t.rating))} />
                    <span className="text-[10px] text-[#D4AF6B]">{timeAgo(typeof t.createdAt === 'string' ? t.createdAt : t.createdAt.toISOString())}</span>
                  </div>
                  <p className="text-[#3D342A] text-sm leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[#F0EAE0]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#111009', color: '#D4AF6B' }}>
                      {initials}
                    </div>
                    <p className="text-sm font-semibold text-[#F5EDD8]">{t.author}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <a href="/" className="text-sm underline text-[#7A6845] hover:text-[#D4AF6B] transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </main>
  )
}
