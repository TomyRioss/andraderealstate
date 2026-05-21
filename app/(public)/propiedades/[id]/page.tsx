import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Property } from '@/types'
import PhotoGallery from '@/components/properties/PhotoGallery'
import VideoPlayer from '@/components/properties/VideoPlayer'
import PropertyMap from '@/components/properties/PropertyMap'
import ReviewForm from '@/components/properties/ReviewForm'
import WhatsAppButton from '@/components/properties/WhatsAppButton'
import ContactFormSidebar from '@/components/properties/ContactFormSidebar'

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
  if (!property) return { title: 'Propiedad no encontrada | Andrade Real Estate' }

  return {
    title: `${property.title} | Andrade Real Estate`,
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

function formatPrice(price: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
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
                <div>
                  <h2 className="font-semibold text-[#1e3a5f] text-lg mb-3">Características</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {features.map(f => (
                      <div key={f.label} className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500">{f.label}</p>
                        <p className="font-semibold text-[#1e3a5f] text-sm">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#1e3a5f] text-lg mb-3">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map(a => (
                      <span key={a} className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features list */}
              {property.features.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#1e3a5f] text-lg mb-3">Extras</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map(f => (
                      <span key={f} className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-semibold text-[#1e3a5f] text-lg mb-2">Descripción</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Map */}
              {property.lat != null && property.lng != null && (
                <div>
                  <h2 className="font-semibold text-[#1e3a5f] text-lg mb-3">Ubicación</h2>
                  <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
                </div>
              )}

              {/* Video */}
              {property.videoUrl && (
                <div>
                  <h2 className="font-semibold text-[#1e3a5f] text-lg mb-3">Video</h2>
                  <VideoPlayer videoUrl={property.videoUrl} />
                </div>
              )}

              {/* Mobile: contact before reviews */}
              <div className="md:hidden flex flex-col gap-4">
                <WhatsAppButton phone={property.whatsapp ?? null} title={property.title} url={pageUrl} />
                <div className="border border-gray-200 rounded-lg p-4">
                  <ContactFormSidebar />
                </div>
              </div>

              {/* Reviews */}
              <div className="border-t border-gray-200 pt-6">
                <ReviewForm propertyId={property.id} />
              </div>
            </div>

            {/* RIGHT column (40%) — desktop sidebar */}
            <div className="hidden md:block md:col-span-2">
              <div className="sticky top-6 flex flex-col gap-4">
                <DesktopHeader property={property} />
                <WhatsAppButton phone={property.whatsapp ?? null} title={property.title} url={pageUrl} />
                <div className="border border-gray-200 rounded-lg p-4">
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
        <span className="text-xs bg-[#1e3a5f] text-white px-2 py-0.5 rounded">
          {CONTRACT_LABELS[property.contractType] ?? property.contractType}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>
      </div>
      <h1 className="text-xl font-bold text-[#1e3a5f]">{property.title}</h1>
      <p className="text-sm text-gray-500">{property.address}, {property.city}, {property.state}</p>
      {property.priceVisible && property.priceMXN != null && (
        <p className="text-2xl font-bold text-[#10b981]">{formatPrice(property.priceMXN)}</p>
      )}
      {!property.priceVisible && (
        <p className="text-sm text-gray-500 italic">Precio a consultar</p>
      )}
    </div>
  )
}

function DesktopHeader({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-[#1e3a5f] text-white px-2 py-0.5 rounded">
          {CONTRACT_LABELS[property.contractType] ?? property.contractType}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-[#1e3a5f]">{property.title}</h1>
      <p className="text-sm text-gray-500">{property.address}, {property.city}, {property.state}</p>
      {property.priceVisible && property.priceMXN != null && (
        <p className="text-3xl font-bold text-[#10b981]">{formatPrice(property.priceMXN)}</p>
      )}
      {!property.priceVisible && (
        <p className="text-sm text-gray-500 italic">Precio a consultar</p>
      )}
    </div>
  )
}
