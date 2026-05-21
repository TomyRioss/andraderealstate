import Hero from '@/components/landing/Hero'
import PropertiesSection from '@/components/landing/PropertiesSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/landing/Footer'
import JsonLd from '@/components/landing/JsonLd'
import { Property, Testimonial } from '@/types'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function fetchProperties(params: string): Promise<Property[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/properties?${params}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data?.data ?? data ?? []
  } catch {
    return []
  }
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/testimonials`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data?.data ?? data ?? []
  } catch {
    return []
  }
}

export default async function LandingPage() {
  const [saleProps, rentProps, devProps, testimonials] = await Promise.all([
    fetchProperties('featured=true&contractType=SALE&limit=6'),
    fetchProperties('featured=true&contractType=RENT&limit=6'),
    fetchProperties('contractType=DEVELOPMENT&limit=6'),
    fetchTestimonials(),
  ])

  return (
    <>
      <JsonLd />
      <Hero />
      <PropertiesSection title="Propiedades en Venta" properties={saleProps} />
      <PropertiesSection title="Propiedades en Renta" properties={rentProps} />
      <PropertiesSection title="Desarrollos" properties={devProps} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
      <Footer />
    </>
  )
}
