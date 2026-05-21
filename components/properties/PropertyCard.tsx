'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
  SALE: 'bg-[#1e3a5f] text-white',
  RENT: 'bg-[#0f172a] text-white',
  DEVELOPMENT: 'bg-[#10b981] text-white',
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
      ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(priceMXN)
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
      <div className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white border border-gray-100">
        {/* Image */}
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          {photos.length > 0 ? (
            <Image
              src={photos[0] ?? ''}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin foto</span>
            </div>
          )}
          {/* Badge */}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md ${contractColor[contractType]}`}>
            {contractLabel[contractType]}
          </span>
          {featured && (
            <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-md bg-[#10b981] text-white">
              Destacado
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-[#0f172a] text-sm leading-snug line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500">
            {city}, {state}
          </p>
          <p className="text-base font-bold text-[#1e3a5f]">{formattedPrice}</p>
          {specs && (
            <p className="text-xs text-gray-500">{specs}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
