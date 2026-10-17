'use client'

import Link from 'next/link'
import { useState } from 'react'
import PropertyCard from '@/components/properties/PropertyCard'
import { Property } from '@/types'

interface PropertiesSectionProps {
  title: string
  properties: Property[]
  href?: string
}

function MobileCarousel({ properties }: { properties: Property[] }) {
  const [active, setActive] = useState(0)
  const property = properties[active]

  function move(direction: number) {
    setActive((index) => (index + direction + properties.length) % properties.length)
  }

  if (!property) return null

  return (
    <div className="mx-auto max-w-md">
      <PropertyCard
        key={property.id}
        id={property.id}
        title={property.title}
        slug={property.slug}
        city={property.city}
        state={property.state}
        contractType={property.contractType}
        category={property.category}
        whatsapp={property.whatsapp ?? null}
        priceMXN={property.priceMXN ?? null}
        priceUSD={property.priceUSD ?? null}
        priceVisible={property.priceVisible}
        bedrooms={property.bedrooms ?? null}
        bathrooms={property.bathrooms ?? null}
        areaSqm={property.areaSqm ?? null}
        photos={property.photos}
        featured={property.featured}
      />

      {properties.length > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Propiedad anterior"
            className="flex h-11 w-11 items-center justify-center border border-[#B3B3B3] text-xl text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
          >
            ‹
          </button>
          <div className="flex items-center gap-2" aria-label="Elegir propiedad">
            {properties.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Mostrar propiedad ${index + 1}: ${item.title}`}
                aria-current={index === active ? 'true' : undefined}
                className={`h-1.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D1A2D] ${
                  index === active ? 'w-8 bg-white' : 'w-4 bg-[#B3B3B3]'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Propiedad siguiente"
            className="flex h-11 w-11 items-center justify-center border border-[#B3B3B3] text-xl text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default function PropertiesSection({ title, properties, href = '/propiedades' }: PropertiesSectionProps) {
  const sectionClasses = 'bg-[#0D1A2D] text-white'
  const linkClasses = 'border-[#B3B3B3] text-white hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline-[#B3B3B3]'

  return (
    <section className={`py-20 md:py-28 ${sectionClasses}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-6 border-b border-current/30 pb-7 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <h2 className="font-display max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <Link
            href={href}
            className={`inline-flex min-h-11 w-fit items-center border px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${linkClasses}`}
          >
            Ver todas las propiedades <span aria-hidden="true" className="ml-3 text-lg">→</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-start justify-between gap-6 border-b border-current/30 py-10 sm:flex-row sm:items-center">
            <p className="max-w-xl text-base leading-7">
              Aún no hay propiedades publicadas en esta categoría. Nuestro equipo puede orientarte sobre la operación que buscas.
            </p>
            <Link
              href="/contacto"
              className={`shrink-0 text-sm font-semibold underline decoration-current underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                isRent ? 'focus-visible:outline-[#B3B3B3]' : 'focus-visible:outline-[#0D1A2D]'
              }`}
            >
              Solicitar orientación
            </Link>
          </div>
        ) : (
          <>
            <div className="lg:hidden">
              <MobileCarousel properties={properties} />
            </div>

            <div className="hidden gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  slug={property.slug}
                  city={property.city}
                  state={property.state}
                  contractType={property.contractType}
                  category={property.category}
                  whatsapp={property.whatsapp ?? null}
                  priceMXN={property.priceMXN ?? null}
                  priceUSD={property.priceUSD ?? null}
                  priceVisible={property.priceVisible}
                  bedrooms={property.bedrooms ?? null}
                  bathrooms={property.bathrooms ?? null}
                  areaSqm={property.areaSqm ?? null}
                  photos={property.photos}
                  featured={property.featured}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
