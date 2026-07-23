import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Property } from '@/types'
import PhotoGallery from '@/components/properties/PhotoGallery'
import VideoPlayer from '@/components/properties/VideoPlayer'
import PropertyMap from '@/components/properties/PropertyMap'
import WhatsAppButton from '@/components/properties/WhatsAppButton'
import ContactFormSidebar from '@/components/properties/ContactFormSidebar'
import PriceDisplay from '@/components/properties/PriceDisplay'

type Props = { params: Promise<{ id: string }> }

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function fetchProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await fetchProperty(id)
  if (!property) return { title: 'Propiedad no encontrada | Grupo Chalita' }

  return {
    title: `${property.title} | Grupo Chalita`,
    description: property.description.slice(0, 160),
    openGraph: {
      images: property.photos[0] ? [property.photos[0]] : [],
    },
  }
}

const CONTRACT_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Renta',
  DEVELOPMENT: 'Desarrollo',
}

const CATEGORY_LABELS: Record<string, string> = {
  HOUSE: 'Casa',
  APARTMENT: 'Departamento',
  LAND: 'Terreno',
  COMMERCIAL: 'Comercial',
  DEVELOPMENT_PROJECT: 'Proyecto',
  OTHER: 'Otro',
}


export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = await fetchProperty(id)
  if (!property) notFound()

  const pageUrl = `${BASE_URL}/propiedades/${id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: pageUrl,
    image: property.photos[0] || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode || undefined,
      addressCountry: 'MX',
    },
    ...(property.priceVisible && property.priceMXN
      ? {
          offers: {
            '@type': 'Offer',
            price: property.priceMXN,
            priceCurrency: 'MXN',
          },
        }
      : {}),
    ...(property.bedrooms != null ? { numberOfRooms: property.bedrooms } : {}),
    ...(property.areaSqm != null
      ? { floorSize: { '@type': 'QuantitativeValue', value: property.areaSqm, unitCode: 'MTK' } }
      : {}),
  }

  const features: { label: string; value: string | number }[] = [
    ...(property.bedrooms != null ? [{ label: 'Recámaras', value: property.bedrooms }] : []),
    ...(property.bathrooms != null ? [{ label: 'Baños', value: property.bathrooms }] : []),
    ...(property.halfBaths != null ? [{ label: 'Medios baños', value: property.halfBaths }] : []),
    ...(property.parkingSpots != null ? [{ label: 'Estacionamientos', value: property.parkingSpots }] : []),
    ...(property.areaSqm != null ? [{ label: 'm² construidos', value: `${property.areaSqm} m²` }] : []),
    ...(property.landAreaSqm != null ? [{ label: 'm² terreno', value: `${property.landAreaSqm} m²` }] : []),
    ...(property.floors != null ? [{ label: 'Niveles', value: property.floors }] : []),
    ...(property.yearBuilt != null ? [{ label: 'Año construcción', value: property.yearBuilt }] : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile bottom padding for sticky WhatsApp button */}
      <div className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

          {/* Mobile: stack | Desktop: 2-col */}
          <div className="flex flex-col md:grid md:grid-cols-5 md:gap-8 gap-6">

            {/* LEFT column (60%) */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {/* Mobile: title above gallery */}
              <div className="md:hidden">
                <MobileHeader property={property} />
              </div>

              <PhotoGallery photos={property.photos} title={property.title} />

              {/* Features */}
              {features.length > 0 && (
                <div className="border border-[#2E2A18] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2E2A18] bg-[#1A1810]">
                    <svg className="w-4 h-4 text-[#7A6845]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <h2 className="font-semibold text-[#F5EDD8] text-base">Características del Inmueble</h2>
                  </div>
                  <div className="divide-y divide-[#2E2A18]">
                    {features.map(f => (
                      <div key={f.label} className="flex justify-between items-center px-4 py-3">
                        <span className="text-sm text-[#7A6845]">{f.label}</span>
                        <span className="text-sm font-medium text-[#D4AF6B]">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#F5EDD8] text-lg mb-3">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map(a => (
                      <span key={a} className="bg-[#1A1810] rounded-full px-3 py-1 text-sm text-[#7A6845]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features list */}
              {property.features.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#F5EDD8] text-lg mb-3">Extras</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map(f => (
                      <span key={f} className="bg-[#1A1810] rounded-full px-3 py-1 text-sm text-[#7A6845]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-semibold text-[#F5EDD8] text-lg mb-2">Descripción</h2>
                <p className="text-[#7A6845] text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Map */}
              {(property.lat != null && property.lng != null) || property.address ? (
                <div>
                  <h2 className="font-semibold text-[#F5EDD8] text-lg mb-3">Ubicación</h2>
                  {property.lat != null && property.lng != null ? (
                    <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-[#2E2A18]">
                      <iframe
                        title="Ubicación en Google Maps"
                        width="100%"
                        height="256"
                        loading="lazy"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.address}, ${property.city}, ${property.state}`)}&output=embed`}
                        className="block"
                      />
                    </div>
                  )}
                  <a
                    href={
                      property.lat != null && property.lng != null
                        ? `https://www.google.com/maps?q=${property.lat},${property.lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.city}, ${property.state}`)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-[#D4AF6B] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Ver en Google Maps
                  </a>
                </div>
              ) : null}

              {/* Video */}
              {property.videoUrl && (
                <div>
                  <h2 className="font-semibold text-[#F5EDD8] text-lg mb-3">Video</h2>
                  <VideoPlayer videoUrl={property.videoUrl} />
                </div>
              )}

              {/* Mobile: contact before reviews */}
              <div className="md:hidden flex flex-col gap-4">
                <WhatsAppButton phone={property.whatsapp ?? null} title={property.title} url={pageUrl} />
                <div className="border border-[#2E2A18] rounded-lg p-4">
                  <ContactFormSidebar />
                </div>
              </div>

            </div>

            {/* RIGHT column (40%) — desktop sidebar */}
            <div className="hidden md:block md:col-span-2">
              <div className="sticky top-6 flex flex-col gap-4">
                <DesktopHeader property={property} />
                <WhatsAppButton phone={property.whatsapp ?? null} title={property.title} url={pageUrl} />
                <div className="border border-[#2E2A18] rounded-lg p-4">
                  <ContactFormSidebar />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

function MobileHeader({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-[#111009] text-white px-2 py-0.5 rounded">
          {CONTRACT_LABELS[property.contractType] ?? property.contractType}
        </span>
        <span className="text-xs bg-[#1A1810] text-[#7A6845] px-2 py-0.5 rounded">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>
      </div>
      <h1 className="text-xl font-bold text-[#F5EDD8]">{property.title}</h1>
      <p className="text-sm text-[#7A6845]">{property.address}, {property.city}, {property.state}</p>
      <PriceDisplay priceMXN={property.priceMXN} priceUSD={property.priceUSD} priceVisible={property.priceVisible} />
    </div>
  )
}

function DesktopHeader({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-[#111009] text-white px-2 py-0.5 rounded">
          {CONTRACT_LABELS[property.contractType] ?? property.contractType}
        </span>
        <span className="text-xs bg-[#1A1810] text-[#7A6845] px-2 py-0.5 rounded">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-[#F5EDD8]">{property.title}</h1>
      <p className="text-sm text-[#7A6845]">{property.address}, {property.city}, {property.state}</p>
      <PriceDisplay priceMXN={property.priceMXN} priceUSD={property.priceUSD} priceVisible={property.priceVisible} sizeLg />
    </div>
  )
}
