export const dynamic = 'force-dynamic'

import Hero from '@/components/landing/Hero'
import PropertiesSection from '@/components/landing/PropertiesSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/landing/Footer'
import JsonLd from '@/components/landing/JsonLd'
import { prisma } from '@/lib/prisma'

export default async function LandingPage() {
  const [saleProps, rentProps, devProps, testimonials, heroProps] = await Promise.all([
    prisma.property.findMany({
      where: { active: true, featured: true, contractType: 'SALE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.property.findMany({
      where: { active: true, featured: true, contractType: 'RENT' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.property.findMany({
      where: { active: true, contractType: 'DEVELOPMENT' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.testimonial.findMany({
      where: { active: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.property.findMany({
      where: { active: true, NOT: { photos: { isEmpty: true } } },
      take: 5,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, photos: true, priceMXN: true, city: true, state: true, slug: true },
    }),
  ])

  return (
    <>
      <JsonLd />
      <Hero properties={heroProps} />
      <PropertiesSection title="Propiedades en Venta" properties={saleProps} />
      <PropertiesSection title="Propiedades en Renta" properties={rentProps} />
      <PropertiesSection title="Desarrollos" properties={devProps} />
      <ContactSection />
      <TestimonialsSection testimonials={testimonials} />
      <Footer />
    </>
  )
}
