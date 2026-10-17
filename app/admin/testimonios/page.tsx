import { listTestimonials } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'
import TestimonialsTable from '@/components/admin/TestimonialsTable'
import { Testimonial } from '@/types'

export default async function TestimoniosPage() {
  const testimonials = sortByCreatedAtDescending(await listTestimonials())
  const active = testimonials.filter((testimonial) => testimonial.active)
  const archived = testimonials.filter((testimonial) => !testimonial.active)

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="font-heading text-3xl font-medium text-[#0D1A2D]">Testimonios</h1>
      </div>
      <TestimonialsTable testimonials={active as unknown as Testimonial[]} archived={archived as unknown as Testimonial[]} />
    </div>
  )
}
