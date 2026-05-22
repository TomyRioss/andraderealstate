import { prisma } from '@/lib/prisma'
import TestimonialsTable from '@/components/admin/TestimonialsTable'
import { Testimonial } from '@/types'

export default async function TestimoniosPage() {
  const [active, archived] = await Promise.all([
    prisma.testimonial.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
    prisma.testimonial.findMany({ where: { active: false }, orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light" style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}>Testimonios</h1>
      </div>
      <TestimonialsTable testimonials={active as unknown as Testimonial[]} archived={archived as unknown as Testimonial[]} />
    </div>
  )
}
