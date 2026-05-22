'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

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

function StarRating({ rating, size = 24 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? '#C9A96E' : '#DCDCE6'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialForm({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [form, setForm] = useState({ author: '', content: '', rating: 0 })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rating === 0) { setErrorMsg('Seleccioná una puntuación'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar')
      }
      setStatus('success')
      setForm({ author: '', content: '', rating: 0 })
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar')
      setStatus('error')
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-end gap-4">
        {children}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#8C7B68' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A96E' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8C7B68' }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Dejá tu reseña
        </button>
      </div>

      {open && (
        <div
          className="mt-4 rounded-xl p-6"
          style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}
        >
          {status === 'success' ? (
            <div className="text-center py-4">
              <p className="font-medium text-sm mb-1" style={{ color: '#18140D' }}>
                ¡Gracias por tu reseña!
              </p>
              <p className="text-xs" style={{ color: '#8C7B68' }}>
                Será publicada una vez verificada.
              </p>
              <button
                onClick={() => { setStatus('idle'); setOpen(false) }}
                className="mt-4 text-xs underline"
                style={{ color: '#C9A96E' }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Stars */}
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: '#5C4F42' }}>
                  Puntuación
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1
                    const filled = val <= (hoverRating || form.rating)
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setForm((f) => ({ ...f, rating: val }))}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? '#C9A96E' : '#E8E0D5'}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color: '#5C4F42' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Tu nombre"
                  className="px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: '#F5F0EA', border: '1px solid #D4C9BC', color: '#18140D' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A96E' }}
                  onBlur={(e) => { e.target.style.borderColor = '#D4C9BC' }}
                />
              </div>

              {/* Review */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color: '#5C4F42' }}>
                  Reseña
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Contá tu experiencia..."
                  className="px-4 py-2.5 text-sm rounded-lg outline-none resize-none"
                  style={{ backgroundColor: '#F5F0EA', border: '1px solid #D4C9BC', color: '#18140D' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A96E' }}
                  onBlur={(e) => { e.target.style.borderColor = '#D4C9BC' }}
                />
              </div>

              {(errorMsg) && (
                <p className="text-xs" style={{ color: '#b91c1c' }}>{errorMsg}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: '#18140D', color: '#C9A96E' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2E2820' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#18140D' }}
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar reseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs"
                  style={{ color: '#8C7B68' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const avg = testimonials.length > 0
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
    : 0
  const avgRounded = Math.round(avg * 10) / 10

  return (
    <section className="py-20" style={{ backgroundColor: '#F5F2EE' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Trustpilot-style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.25em] uppercase font-semibold">
                Reseñas verificadas
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl text-[#18140D] leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Lo que dicen nuestros clientes
            </h2>
          </div>

          {/* Score badge */}
          {testimonials.length > 0 && <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-5xl font-bold text-[#18140D] leading-none">{avgRounded}</p>
              <p className="text-xs text-[#8C7B68] mt-1">de 5.0</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <StarRating rating={Math.round(avg)} size={20} />
              <p className="text-xs text-[#8C7B68]">
                Basado en {testimonials.length} reseña{testimonials.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>}
        </div>

        {/* Cards */}
        {testimonials.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center"
            style={{ backgroundColor: '#fff', border: '1px dashed #D4C9BC' }}
          >
            <p className="text-sm" style={{ color: '#8C7B68' }}>
              Próximamente — compartí tu experiencia con nosotros.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => {
            const rating = Math.max(0, Math.min(5, t.rating))
            const initials = t.author
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()

            return (
              <div
                key={t.id}
                className="bg-white rounded-xl p-6 flex flex-col gap-4"
                style={{ border: '1px solid #E8E0D5' }}
              >
                {/* Stars + date */}
                <div className="flex items-center justify-between">
                  <StarRating rating={rating} size={18} />
                  <span className="text-[10px] text-[#B0A090] tracking-wide">
                    {timeAgo(t.createdAt)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-[#3D342A] text-sm leading-relaxed flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#F0EAE0]">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#18140D', color: '#C9A96E' }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#18140D]">{t.author}</p>
                    {t.location && (
                      <p className="text-xs text-[#8C7B68]">{t.location}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )}

        <TestimonialForm>
          {testimonials.length > 0 && (
            <Link
              href="/testimonios"
              className="px-8 py-3 text-sm font-semibold rounded-lg transition-colors shrink-0"
              style={{ backgroundColor: '#18140D', color: '#C9A96E' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2E2820' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#18140D' }}
            >
              Ver todas las reseñas
            </Link>
          )}
        </TestimonialForm>

      </div>
    </section>
  )
}
