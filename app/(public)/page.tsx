export const dynamic = 'force-dynamic'

import Hero from '@/components/landing/Hero'
import BrandSection from '@/components/landing/BrandSection'
import PropertiesSection from '@/components/landing/PropertiesSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ContactSection from '@/components/landing/ContactSection'
import JsonLd from '@/components/landing/JsonLd'
import { listProperties, listTestimonials } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'

export default async function LandingPage() {
  const [properties, allTestimonials] = await Promise.all([listProperties(), listTestimonials()])
  const recentProperties = sortByCreatedAtDescending(properties.filter((property) => property.active && property.featured))
  const saleProps = recentProperties.filter((property) => property.contractType === 'SALE').slice(0, 6)
  const rentProps = recentProperties.filter((property) => property.contractType === 'RENT').slice(0, 6)
  const devProps = sortByCreatedAtDescending(properties.filter((property) => property.active && property.contractType === 'DEVELOPMENT')).slice(0, 6)
  const vacationProps = sortByCreatedAtDescending(properties.filter((property) => property.active && property.category === 'VACATION_STAY')).slice(0, 6)
  const testimonials = sortByCreatedAtDescending(allTestimonials.filter((testimonial) => testimonial.active)).slice(0, 6)
  const heroProps = sortByCreatedAtDescending(
    properties.filter((property) => property.active && property.featured && property.photos?.length > 0),
  ).map(({ id, title, photos, priceMXN, city, state, slug }) => ({ id, title, photos, priceMXN: priceMXN ?? null, city, state, slug }))
  const brandProperties = properties
    .filter((property) => property.active)
    .flatMap((property) => {
      const photo = property.photos?.find((item) => item.trim())
      return photo ? [{
        id: property.id,
        title: property.title,
        photo,
        priceMXN: property.priceMXN ?? null,
        priceUSD: property.priceUSD ?? null,
        priceVisible: property.priceVisible,
      }] : []
    })

  return (
    <>
      <JsonLd />
      <Hero properties={heroProps} />
      <BrandSection properties={brandProperties} />
      <PropertiesSection title="Propiedades en Venta" properties={saleProps} />
      <PropertiesSection title="Propiedades en Renta" properties={rentProps} />
      <PropertiesSection title="Estancias vacacionales" properties={vacationProps} href="/propiedades?category=VACATION_STAY" />
      <PropertiesSection title="Desarrollos" properties={devProps} />
      <ContactSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
