'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/lib/contexts/CurrencyContext'
import { buildWhatsappLink } from '@/lib/whatsapp'

interface PropertyCardProps {
  id: string
  title: string
  slug: string
  city: string
  state: string
  contractType: 'SALE' | 'RENT' | 'DEVELOPMENT'
  category: string
  whatsapp?: string | null
  priceMXN?: number | null
  priceUSD?: number | null
  priceVisible: boolean
  bedrooms?: number | null
  bathrooms?: number | null
  areaSqm?: number | null
  photos: string[]
  featured: boolean
}

export default function PropertyCard({
  title,
  slug,
  city,
  state,
  category,
  whatsapp,
  priceMXN,
  priceUSD,
  priceVisible,
  bedrooms,
  bathrooms,
  areaSqm,
  photos,
}: PropertyCardProps) {
  const { currency } = useCurrency()
  const isVacationStay = category === 'VACATION_STAY'
  const propertyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/propiedades/${slug}`
  const whatsappPhone = whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || '5213221682424'
  const reservationMessage = `Hola, quiero consultar disponibilidad para reservar la estancia vacacional "${title}". Puedes ver más detalles aquí: ${propertyUrl}`
  const reservationHref = isVacationStay
    ? buildWhatsappLink(whatsappPhone, title, propertyUrl, reservationMessage)
    : null

  const formattedPrice = (() => {
    if (!priceVisible) return 'Precio a consultar'

    if (currency === 'USD' && priceUSD != null) {
      return `USD $${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(priceUSD)}`
    }
    if (currency === 'MXN' && priceMXN != null) {
      return `MXN $${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(priceMXN)}`
    }

    return 'Precio a consultar'
  })()

  const specs = [
    bedrooms != null ? `${bedrooms} hab.` : null,
    bathrooms != null ? `${bathrooms} baños` : null,
    areaSqm != null ? `${areaSqm} m²` : null,
  ].filter(Boolean)

  return (
    <article className="flex h-full flex-col overflow-hidden border border-[#B3B3B3] bg-white text-[#0D1A2D]">
      <Link
        href={`/propiedades/${slug}`}
        aria-label={`Ver propiedad: ${title}`}
        className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#B3B3B3]">
          {photos[0] ? (
            <Image
              src={photos[0]}
              alt={title}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#B3B3B3] px-5 text-center text-sm font-medium text-[#0D1A2D]">
              Fotografía no disponible
            </div>
          )}

        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#0D1A2D]">
            {city}, {state}
          </p>
          {isVacationStay && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0D1A2D]">
              Estancia vacacional
            </p>
          )}
          <h3 className="font-display mt-2 line-clamp-2 text-xl font-medium leading-snug">
            {title}
          </h3>
          <p className="mt-4 text-lg font-semibold tracking-tight sm:text-xl">
            {formattedPrice}
          </p>

          {specs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 border-t border-[#B3B3B3] pt-4 text-xs font-medium">
              {specs.map((spec) => <span key={spec}>{spec}</span>)}
            </div>
          )}
        </div>
      </Link>

      {reservationHref && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <p className="mb-3 text-sm text-[#0D1A2D]">Reservas sujetas a disponibilidad.</p>
          <a
            href={reservationHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center bg-[#0D1A2D] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
          >
            Consultar disponibilidad por WhatsApp
          </a>
        </div>
      )}
    </article>
  )
}
