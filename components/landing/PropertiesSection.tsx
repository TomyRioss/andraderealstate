'use client'

import PropertyCard from '@/components/properties/PropertyCard'
import { Property } from '@/types'

interface PropertiesSectionProps {
  title: string
  properties: Property[]
}

export default function PropertiesSection({ title, properties }: PropertiesSectionProps) {
  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-8 font-sans">{title}</h2>
        {properties.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No hay propiedades disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
