'use client'

import Image from 'next/image'
import Link from 'next/link'

interface PropertyCardProps {
  id: string
  title: string
  slug: string
  city: string
  state: string
  contractType: 'SALE' | 'RENT' | 'DEVELOPMENT'
  category: string
  priceMXN?: number | null
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
  SALE: 'bg-[#1B2E4B] text-white',
  RENT: 'bg-[#18140D] text-white',
  DEVELOPMENT: 'bg-[#B07030] text-white',
}

export default function PropertyCard({
  title,
  slug,
  city,
  state,
  contractType,
  priceMXN,
  priceVisible,
  bedrooms,
  bathrooms,
  areaSqm,
  photos,
  featured,
}: PropertyCardProps) {
  const formattedPrice =
    priceVisible && priceMXN != null
      ? new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          maximumFractionDigits: 0,
        }).format(priceMXN)
      : 'Precio a consultar'

  const specs = [
    bedrooms != null ? `${bedrooms} hab` : null,
    bathrooms != null ? `${bathrooms} baños` : null,
    areaSqm != null ? `${areaSqm} m²` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link href={`/propiedades/${slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-[#E8E2D9] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(24,20,13,0.12)] transition-all duration-300">
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
            <div className="absolute inset-0 bg-[#F0EDE8] flex items-center justify-center">
              <span className="text-[#A89880] text-xs tracking-wide uppercase">Sin fotografía</span>
            </div>
          )}
          <span className={`absolute top-3 left-3 rounded-full text-xs font-medium px-3 py-1 tracking-wider ${contractColor[contractType]}`}>
            {contractLabel[contractType]}
          </span>
          {featured && (
            <span className="absolute top-3 right-3 rounded-full bg-[#B07030] text-white text-xs font-medium px-3 py-1 tracking-wide">
              Destacado
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs text-[#A89880] font-medium uppercase tracking-[0.15em] mb-1.5">
            {city}, {state}
          </p>
          <h3 className="text-sm font-semibold text-[#18140D] leading-snug line-clamp-2 group-hover:text-[#1B2E4B] transition-colors mb-3">
            {title}
          </h3>
          <p
            className="text-xl font-semibold text-[#1B2E4B] mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {formattedPrice}
          </p>
          {specs && (
            <div className="border-t border-[#F0EDE8] pt-3">
              <p className="text-xs text-[#A89880] tracking-wide">{specs}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
