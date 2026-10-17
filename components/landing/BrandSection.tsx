'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCurrency } from '@/lib/contexts/CurrencyContext'

type BrandProperty = {
  id: string
  title: string
  photo: string
  priceMXN?: number | null
  priceUSD?: number | null
  priceVisible: boolean
}

export default function BrandSection({ properties }: { properties: BrandProperty[] }) {
  const { currency } = useCurrency()
  const propertyCount = properties.length
  const [current, setCurrent] = useState(0)
  const visibleProperties = properties.length > 1
    ? [properties[current % properties.length], properties[(current + 1) % properties.length]]
      .filter((property): property is BrandProperty => Boolean(property))
    : properties

  function getPrice(property: BrandProperty): string | null {
    if (!property.priceVisible) return null

    if (currency === 'USD' && property.priceUSD != null) {
      return `USD $${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(property.priceUSD)}`
    }
    if (currency === 'MXN' && property.priceMXN != null) {
      return `MXN $${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(property.priceMXN)}`
    }

    return null
  }

  useEffect(() => {
    if (propertyCount < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      const offset = 1 + Math.floor(Math.random() * (propertyCount - 1))
      setCurrent((index) => (index + offset) % propertyCount)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [propertyCount])

  return (
    <section aria-labelledby="andrade-brand-title" className="bg-[#0D1A2D] text-white">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,2fr)] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div className="max-w-[400px]">
          <span aria-hidden="true" className="mb-7 block h-px w-11 bg-[#B3B3B3]" />
          <h2 id="andrade-brand-title" className="font-display text-[2.15rem] leading-[1.08] tracking-[-0.035em] sm:text-[2.7rem]">
            Andrade &amp; Co
            <br />
            Real Estate
          </h2>
          <p className="mt-5 font-display text-xl leading-relaxed">
            Una visión compartida.
            <br />
            Un servicio cercano.
          </p>
          <p className="mt-5 text-sm leading-6">
            Una agencia liderada por Claudia Andrade.
          </p>
        </div>

        <div role="group" aria-label="Propiedades seleccionadas" className="grid grid-cols-2 gap-3 sm:gap-5">
          {visibleProperties.length > 0 ? visibleProperties.map((property, index) => {
            const price = getPrice(property)

            return (
              <div
                key={`${property.id}-${current}`}
                className={`brand-property-enter relative aspect-[1.55] overflow-hidden bg-white ${
                  visibleProperties.length === 1 ? 'col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <Image
                  src={property.photo}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 1023px) 50vw, 38vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 z-10 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <h3 className="text-base font-semibold leading-snug sm:text-lg">{property.title}</h3>
                  {price && <p className="mt-1 text-sm font-medium">{price}</p>}
                </div>
              </div>
            )
          }) : (
            <div className="relative col-span-2 aspect-[1.7] overflow-hidden bg-white">
              <Image
                src="/hero-property-pexels.jpeg"
                alt="Casa contemporánea rodeada de vegetación"
                fill
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
