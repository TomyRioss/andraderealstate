'use client'

import Link from 'next/link'
import { useState } from 'react'
import PropertyCard from '@/components/properties/PropertyCard'
import { Property } from '@/types'

interface PropertiesSectionProps {
  title: string
  properties: Property[]
}

function MobileCarousel({ properties }: { properties: Property[] }) {
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i - 1 + properties.length) % properties.length)
  const next = () => setActive((i) => (i + 1) % properties.length)

  const getOffset = (idx: number) => {
    const diff = idx - active
    if (diff === 0) return 0
    if (diff === 1 || diff === -(properties.length - 1)) return 1
    if (diff === -1 || diff === properties.length - 1) return -1
    return diff > 0 ? 2 : -2
  }

  return (
    <div className="relative">
      <div className="relative h-[480px] overflow-hidden">
        {properties.map((p, idx) => {
          const offset = getOffset(idx)
          const isActive = offset === 0
          const isAdjacent = Math.abs(offset) === 1

          return (
            <div
              key={p.id}
              onClick={() => { if (!isActive) setActive(idx) }}
              className="absolute top-0 transition-all duration-500 ease-in-out"
              style={{
                width: '75%',
                left: '50%',
                transform: `translateX(calc(-50% + ${offset * 82}%)) scale(${isActive ? 1 : 0.88})`,
                opacity: isActive ? 1 : isAdjacent ? 0.45 : 0,
                zIndex: isActive ? 10 : isAdjacent ? 5 : 0,
                pointerEvents: isActive ? 'auto' : isAdjacent ? 'auto' : 'none',
                cursor: isAdjacent ? 'pointer' : 'default',
              }}
            >
              <PropertyCard
                id={p.id}
                title={p.title}
                slug={p.slug}
                city={p.city}
                state={p.state}
                contractType={p.contractType}
                category={p.category}
                priceMXN={p.priceMXN ?? null}
                priceUSD={p.priceUSD ?? null}
                priceVisible={p.priceVisible}
                bedrooms={p.bedrooms ?? null}
                bathrooms={p.bathrooms ?? null}
                areaSqm={p.areaSqm ?? null}
                photos={p.photos}
                featured={p.featured}
              />
            </div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {properties.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`rounded-full transition-all duration-300 ${idx === active ? 'w-6 h-2 bg-[#1A5F9E]' : 'w-2 h-2 bg-[#AED6F1]'}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-1 top-1/2 -translate-y-8 z-20 w-8 h-8 rounded-full bg-white border border-[#AED6F1] flex items-center justify-center text-[#0D3B66] shadow-sm hover:bg-[#E8F4FD] transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-1 top-1/2 -translate-y-8 z-20 w-8 h-8 rounded-full bg-white border border-[#AED6F1] flex items-center justify-center text-[#0D3B66] shadow-sm hover:bg-[#E8F4FD] transition-colors"
      >
        ›
      </button>
    </div>
  )
}

export default function PropertiesSection({ title, properties }: PropertiesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#1A5F9E]" />
              <span className="text-[#1A5F9E] text-xs tracking-[0.25em] uppercase font-medium">Propiedades</span>
            </div>
            <h2
              className="text-4xl md:text-5xl text-[#0D3B66] leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              {title}
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="hidden md:flex items-center gap-2 text-sm text-[#4A7BA7] hover:text-[#0D3B66] font-medium transition-colors tracking-wide group"
          >
            Ver todas
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="py-20 text-[#4A7BA7] text-center text-sm">
            No hay propiedades disponibles en este momento.
          </div>
        ) : (
          <>
            {/* Mobile: carousel */}
            <div className="lg:hidden">
              <MobileCarousel properties={properties} />
            </div>

            {/* Desktop: grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
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
                  priceUSD={p.priceUSD ?? null}
                  priceVisible={p.priceVisible}
                  bedrooms={p.bedrooms ?? null}
                  bathrooms={p.bathrooms ?? null}
                  areaSqm={p.areaSqm ?? null}
                  photos={p.photos}
                  featured={p.featured}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
