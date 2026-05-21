'use client'

import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-12 px-4 md:px-8 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-8 font-sans text-center">
          Lo que dicen nuestros clientes
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-[280px] md:min-w-0 snap-start bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="text-[#10b981] text-lg tracking-wide">
                {'★'.repeat(Math.max(0, Math.min(5, t.rating)))}
                {'☆'.repeat(Math.max(0, 5 - Math.min(5, t.rating)))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.content}"</p>
              <div>
                <p className="font-semibold text-[#0f172a] text-sm">{t.author}</p>
                {t.location && (
                  <p className="text-xs text-gray-400">{t.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
