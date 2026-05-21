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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#10b981] text-xs font-bold uppercase tracking-[0.15em] mb-2">
              Propiedades
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a]">{title}</h2>
            <div className="mt-3 w-12 h-1 bg-[#10b981] rounded-full" />
          </div>
          <Link
            href="/propiedades"
            className="hidden md:block text-sm text-[#1e3a5f] font-semibold hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {/* Grid / Empty */}
        {properties.length === 0 ? (
          <div className="py-16 text-[#9ca3af] text-center">
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
