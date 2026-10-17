'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'
import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

function timeAgo(dateValue: string | Date): string {
  const timestamp = new Date(dateValue).getTime()
  if (!Number.isFinite(timestamp)) return ''

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years >= 1) return `hace ${years} año${years > 1 ? 's' : ''}`
  if (months >= 1) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  if (days >= 1) return `hace ${days} día${days > 1 ? 's' : ''}`
  if (hours >= 1) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`
}

function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <span role="img" aria-label={`${safeRating} de 5 estrellas`} className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          aria-hidden="true"
          size={size}
          className={index < safeRating ? 'text-[#0D1A2D]' : 'text-[#B3B3B3]'}
        />
      ))}
    </span>
  )
}

function TestimonialForm({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [form, setForm] = useState({ author: '', content: '', rating: 0 })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (form.rating === 0) {
      setErrorMsg('Selecciona una puntuación antes de enviar.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'No pudimos enviar la reseña. Intenta nuevamente.')
      }

      setStatus('success')
      setForm({ author: '', content: '', rating: 0 })
    } catch (error: unknown) {
      console.error('No se pudo enviar la reseña:', error)
      setErrorMsg(error instanceof Error ? error.message : 'No pudimos enviar la reseña. Intenta nuevamente.')
      setStatus('error')
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-[#B3B3B3] pt-6 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          {children}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="testimonial-form"
            className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#0D1A2D] underline decoration-[#B3B3B3] underline-offset-4 transition-colors hover:decoration-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D1A2D]"
          >
            <span aria-hidden="true" className="text-xl leading-none">{open ? '−' : '+'}</span>
            Deja tu reseña
          </button>
        </div>
      </div>

      {open && (
        <div id="testimonial-form" className="mt-5 border border-[#0D1A2D] bg-[#B3B3B3] p-5 sm:p-7">
          {status === 'success' ? (
            <div className="py-3" role="status">
              <p className="font-display text-2xl font-medium text-[#0D1A2D]">Gracias por compartir tu experiencia.</p>
              <p className="mt-2 text-sm leading-6 text-[#0D1A2D]">La reseña se publicará después de ser verificada.</p>
              <button
                type="button"
                onClick={() => { setStatus('idle'); setOpen(false) }}
                className="mt-5 min-h-11 border border-[#0D1A2D] px-5 text-sm font-semibold text-[#0D1A2D] transition-colors hover:bg-[#0D1A2D] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-[#0D1A2D]">Puntuación</legend>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1
                    const filled = value <= (hoverRating || form.rating)

                    return (
                      <button
                        key={value}
                        type="button"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(value)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() => { setForm((current) => ({ ...current, rating: value })); setErrorMsg('') }}
                        aria-label={`${value} ${value === 1 ? 'estrella' : 'estrellas'}`}
                        aria-pressed={form.rating === value}
                        className="flex h-10 w-10 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
                      >
                        <FaStar aria-hidden="true" size={24} className={filled ? 'text-[#0D1A2D]' : 'text-white'} />
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="testimonial-author" className="text-sm font-semibold text-[#0D1A2D]">Nombre</label>
                <input
                  id="testimonial-author"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  value={form.author}
                  onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
                  placeholder="Tu nombre"
                  className="min-h-12 border border-[#0D1A2D] bg-white px-4 text-sm text-[#0D1A2D] outline-none placeholder:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="testimonial-content" className="text-sm font-semibold text-[#0D1A2D]">Reseña</label>
                <textarea
                  id="testimonial-content"
                  required
                  minLength={10}
                  rows={4}
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  placeholder="Comparte tu experiencia con nuestro equipo."
                  className="resize-y border border-[#0D1A2D] bg-white px-4 py-3 text-sm leading-6 text-[#0D1A2D] outline-none placeholder:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
                />
              </div>

              {status === 'error' && errorMsg && (
                <p role="alert" className="border border-[#0D1A2D] bg-[#0D1A2D] px-4 py-3 text-sm leading-6 text-white">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="min-h-12 bg-[#0D1A2D] px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando reseña…' : 'Enviar reseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-11 px-2 text-sm font-medium text-[#0D1A2D] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
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
  const testimonialsTrackRef = useRef<HTMLDivElement>(null)
  const [canScrollTestimonialsBack, setCanScrollTestimonialsBack] = useState(false)
  const [canScrollTestimonialsForward, setCanScrollTestimonialsForward] = useState(false)
  const average = testimonials.length > 0
    ? testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) / testimonials.length
    : 0
  const averageRounded = Math.round(average * 10) / 10

  useEffect(() => {
    const track = testimonialsTrackRef.current
    if (!track) return

    const updateScrollControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth
      setCanScrollTestimonialsBack(track.scrollLeft > 1)
      setCanScrollTestimonialsForward(maxScroll - track.scrollLeft > 1)
    }

    updateScrollControls()
    track.addEventListener('scroll', updateScrollControls, { passive: true })
    window.addEventListener('resize', updateScrollControls)

    return () => {
      track.removeEventListener('scroll', updateScrollControls)
      window.removeEventListener('resize', updateScrollControls)
    }
  }, [testimonials.length])

  function scrollTestimonials(direction: -1 | 1) {
    const track = testimonialsTrackRef.current
    const firstCard = track?.querySelector<HTMLElement>('[data-testimonial-card]')
    if (!track || !firstCard) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    track.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <section className="bg-white py-20 text-[#0D1A2D] md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-8 border-b border-[#B3B3B3] pb-8 md:mb-12 md:flex-row md:items-end md:justify-between md:pb-10">
          <h2 className="font-display max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Lo que dicen nuestros clientes
          </h2>

          {testimonials.length > 0 && (
            <div className="flex items-center gap-5 md:shrink-0">
              <div>
                <p className="font-display text-5xl font-medium leading-none">{averageRounded.toFixed(1)}</p>
                <p className="mt-1 text-xs">Promedio sobre 5</p>
              </div>
              <div className="border-l border-[#B3B3B3] pl-5">
                <StarRating rating={average} size={18} />
                <p className="mt-2 text-xs">
                  {testimonials.length} reseña{testimonials.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        {testimonials.length === 0 ? (
          <div className="border-y border-[#B3B3B3] py-9">
            <p className="max-w-xl text-base leading-7">
              Aún no hay reseñas publicadas. Si ya trabajaste con nuestro equipo, comparte tu experiencia.
            </p>
          </div>
        ) : (
          <>
            {testimonials.length > 1 && (
              <div className="mb-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => scrollTestimonials(-1)}
                  disabled={!canScrollTestimonialsBack}
                  aria-label="Ver reseñas anteriores"
                  aria-controls="testimonials-slider"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[#B3B3B3] text-xl text-[#0D1A2D] transition-colors hover:bg-[#0D1A2D] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0D1A2D]"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollTestimonials(1)}
                  disabled={!canScrollTestimonialsForward}
                  aria-label="Ver reseñas siguientes"
                  aria-controls="testimonials-slider"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[#B3B3B3] text-xl text-[#0D1A2D] transition-colors hover:bg-[#0D1A2D] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0D1A2D]"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            <div
              id="testimonials-slider"
              ref={testimonialsTrackRef}
              role="region"
              aria-roledescription="carrusel"
              aria-label="Reseñas de clientes"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D1A2D] motion-reduce:scroll-auto"
            >
            {testimonials.map((testimonial, index) => {
              const initials = testimonial.author
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join('')
                .toUpperCase()
              const dateLabel = timeAgo(testimonial.createdAt)

              return (
                <article
                  key={testimonial.id}
                  data-testimonial-card
                  aria-roledescription="diapositiva"
                  aria-label={`Reseña ${index + 1} de ${testimonials.length}`}
                  className="flex min-h-[240px] basis-[84%] shrink-0 snap-start flex-col border-t border-[#0D1A2D] pt-5 md:basis-[calc(50%_-_0.75rem)] xl:basis-[calc(33.333%_-_1rem)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <StarRating rating={testimonial.rating} size={17} />
                    {dateLabel && <time className="text-xs" dateTime={new Date(testimonial.createdAt).toISOString()}>{dateLabel}</time>}
                  </div>
                  <p className="font-display mt-6 flex-1 text-lg leading-7">
                    “{testimonial.content}”
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#B3B3B3] pt-4">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D1A2D] text-xs font-semibold text-white">
                      {initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.author}</p>
                      {testimonial.location && <p className="mt-1 text-xs">{testimonial.location}</p>}
                    </div>
                  </div>
                </article>
              )
            })}
            </div>
          </>
        )}

        <TestimonialForm>
          {testimonials.length > 0 && (
            <Link
              href="/testimonios"
              className="inline-flex min-h-11 items-center bg-[#0D1A2D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
            >
              Ver todas las reseñas
            </Link>
          )}
        </TestimonialForm>
      </div>
    </section>
  )
}
