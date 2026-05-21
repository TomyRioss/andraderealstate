'use client'

import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-20 bg-[#18140D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#B07030]" />
            <span className="text-[#B07030] text-xs tracking-[0.25em] uppercase font-medium">Testimonios</span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => {
            const rating = Math.max(0, Math.min(5, t.rating))
            return (
              <div
                key={t.id}
                className="bg-[#1E1910] rounded-xl p-6 border border-[#2E2820]"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rating ? 'text-[#B07030]' : 'text-[#3A3028]'}>★</span>
                  ))}
                </div>
                <p className="text-[#C8BCAE] text-sm leading-relaxed mb-5 font-light">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <p className="text-white font-medium text-sm">{t.author}</p>
                  {t.location != null && (
                    <p className="text-[#6B5E4E] text-xs mt-0.5">{t.location}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
