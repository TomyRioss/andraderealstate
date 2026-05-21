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
      <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative w-full aspect-video">
          {photos.length > 0 ? (
            <Image
              src={photos[0] ?? ''}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-[#f8f9ff] flex items-center justify-center">
              <span className="text-[#9ca3af] text-sm">Sin fotografía</span>
            </div>
          )}
          <span
            className={`absolute top-3 left-3 rounded-full text-xs font-bold px-3 py-1 ${contractColor[contractType]}`}
          >
            {contractLabel[contractType]}
          </span>
          {featured && (
            <span className="absolute top-3 right-3 rounded-full bg-[#10b981] text-white text-xs font-bold px-2.5 py-1">
              Destacado
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wide">
            {city}, {state}
          </p>
          <h3 className="text-base font-bold text-[#0f172a] leading-snug line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
            {title}
          </h3>
          <p className="text-xl font-black text-[#1e3a5f]">{formattedPrice}</p>
          {specs && (
            <div className="border-t border-[#f3f4f6] pt-3">
              <p className="flex gap-3 text-xs text-[#6b7280]">{specs}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
