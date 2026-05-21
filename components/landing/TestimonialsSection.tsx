'use client'

import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-20 bg-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#10b981] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Testimonios
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => {
            const rating = Math.max(0, Math.min(5, t.rating))
            return (
              <div
                key={t.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div>
                  <span className="text-[#10b981]">{'★'.repeat(rating)}</span>
                  <span className="text-white/20">{'★'.repeat(5 - rating)}</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mt-3 mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                <p className="text-white font-bold text-sm">{t.author}</p>
                {t.location != null && (
                  <p className="text-white/50 text-xs">{t.location}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
