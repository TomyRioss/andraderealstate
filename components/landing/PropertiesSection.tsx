'use client'

import Link from 'next/link'
import PropertyCard from '@/components/properties/PropertyCard'
import { Property } from '@/types'

interface PropertiesSectionProps {
  title: string
  properties: Property[]
}

export default function PropertiesSection({ title, properties }: PropertiesSectionProps) {
  return (
    <section className="py-20 bg-[#F7F3EE]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#B07030]" />
              <span className="text-[#B07030] text-xs tracking-[0.25em] uppercase font-medium">Propiedades</span>
            </div>
            <h2
              className="text-4xl md:text-5xl text-[#18140D] leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              {title}
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="hidden md:flex items-center gap-2 text-sm text-[#5C5047] hover:text-[#18140D] font-medium transition-colors tracking-wide group"
          >
            Ver todas
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="py-20 text-[#A89880] text-center text-sm">
            No hay propiedades disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                slug={p.slug}
                city={p.city}
                state={p.state}
                contractType={p.contractType}
                category={p.category}
                priceMXN={p.priceMXN ?? null}
                priceVisible={p.priceVisible}
                bedrooms={p.bedrooms ?? null}
                bathrooms={p.bathrooms ?? null}
                areaSqm={p.areaSqm ?? null}
                photos={p.photos}
                featured={p.featured}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
