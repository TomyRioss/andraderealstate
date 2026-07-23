'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/lib/contexts/CurrencyContext'

interface PropertyCardProps {
  id: string
  title: string
  slug: string
  city: string
  state: string
  contractType: 'SALE' | 'RENT' | 'DEVELOPMENT'
  category: string
  priceMXN?: number | null
  priceUSD?: number | null
  priceVisible: boolean
  bedrooms?: number | null
  bathrooms?: number | null
  areaSqm?: number | null
  photos: string[]
  featured: boolean
}

const contractLabel: Record<PropertyCardProps['contractType'], string> = {
  SALE: 'Venta',
  RENT: 'Renta',
  DEVELOPMENT: 'Desarrollo',
}

const contractColor: Record<PropertyCardProps['contractType'], string> = {
  SALE: 'bg-[#111009] text-white',
  RENT: 'bg-[#111009] text-white',
  DEVELOPMENT: 'bg-[#B8912A] text-white',
}

export default function PropertyCard({
  title,
  slug,
  city,
  state,
  contractType,
  priceMXN,
  priceUSD,
  priceVisible,
  bedrooms,
  bathrooms,
  areaSqm,
  photos,
  featured,
}: PropertyCardProps) {
  const { currency } = useCurrency()

  const formattedPrice = (() => {
    if (!priceVisible) return 'Precio a consultar'
    if (currency === 'USD') {
      if (priceUSD != null) {
        return 'USD $' + new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(priceUSD)
      }
      return 'USD ---'
    }
    if (priceMXN != null) {
      return 'MXN $' + new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(priceMXN)
    }
    return 'Precio a consultar'
  })()

  const specs = [
    bedrooms != null ? `${bedrooms} hab` : null,
    bathrooms != null ? `${bathrooms} baños` : null,
    areaSqm != null ? `${areaSqm} m²` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link href={`/propiedades/${slug}`} className="group block">
      <div className="bg-[#1A1810] rounded-xl overflow-hidden border border-[#2E2A18] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(14,10,18,0.12)] transition-all duration-300">
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden">
          {photos.length > 0 ? (
            <Image
              src={photos[0] ?? ''}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1810] flex items-center justify-center">
              <span className="text-[#7A6845] text-xs tracking-wide uppercase">Sin fotografía</span>
            </div>
          )}
          <span className={`absolute top-3 left-3 rounded-full text-xs font-medium px-3 py-1 tracking-wider ${contractColor[contractType]}`}>
            {contractLabel[contractType]}
          </span>
          {featured && (
            <span className="absolute top-3 right-3 rounded-full bg-[#B8912A] text-white text-xs font-medium px-3 py-1 tracking-wide">
              Destacado
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs text-[#7A6845] font-medium uppercase tracking-[0.15em] mb-1.5">
            {city}, {state}
          </p>
          <h3 className="text-sm font-semibold text-[#F5EDD8] leading-snug line-clamp-2 group-hover:text-[#B8912A] transition-colors mb-3">
            {title}
          </h3>
          <p className="text-xl font-semibold text-[#F5EDD8] mb-3 tracking-tight font-sans">
            {formattedPrice}
          </p>
          {specs && (
            <div className="border-t border-[#2E2A18] pt-3">
              <p className="text-xs text-[#7A6845] tracking-wide">{specs}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
