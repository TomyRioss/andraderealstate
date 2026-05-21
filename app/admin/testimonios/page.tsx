import { prisma } from '@/lib/prisma'
import TestimonialsTable from '@/components/admin/TestimonialsTable'
import { Testimonial } from '@/types'

export default async function TestimoniosPage() {
  const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  const testimonials = rows as unknown as Testimonial[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Testimonios</h1>
      <TestimonialsTable testimonials={testimonials} />
    </div>
  )
}
