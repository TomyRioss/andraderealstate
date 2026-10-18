export const dynamic = 'force-dynamic'

import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import Pagination from '@/components/properties/Pagination'
import { listProperties } from '@/lib/pocketbase-data'
import { filterProperties, sortByCreatedAtDescending } from '@/lib/property-search'
import type { Property } from '@/types'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function PropiedadesPage({ searchParams }: PageProps) {
  const params = await searchParams

  const {
    contractType,
    category,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    search,
    page = '1',
  } = params

  const limit = 12
  const currentPage = Math.max(1, Number(page) || 1)

  const numeric = (value?: string) => {
    if (!value) return undefined
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  const requestedBedrooms = bedrooms ? Number.parseInt(bedrooms, 10) : undefined
  const filtered = filterProperties(await listProperties(), {
    activeOnly: true,
    contractType,
    category,
    city,
    search,
    minBedrooms: requestedBedrooms !== undefined && Number.isFinite(requestedBedrooms) ? requestedBedrooms : undefined,
    minPrice: numeric(minPrice),
    maxPrice: numeric(maxPrice),
  })
  const ordered = sortByCreatedAtDescending(filtered)
  const total = ordered.length
  const data = ordered.slice((currentPage - 1) * limit, currentPage * limit)

  const totalPages = Math.ceil(total / limit)
  const { page: _p, ...filtersOnly } = params

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0D1A2D]">Propiedades</h1>

        <PropertyFilters
          contractType={contractType ?? undefined}
          category={category ?? undefined}
          city={city ?? undefined}
          minPrice={minPrice ?? undefined}
          maxPrice={maxPrice ?? undefined}
          bedrooms={bedrooms ?? undefined}
          search={search ?? undefined}
        />

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#7A6845] space-y-2">
            <p className="text-lg font-medium">Sin resultados</p>
            <p className="text-sm">Intenta ajustar los filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#7A6845]">
              {total} propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  slug={property.slug}
                  city={property.city}
                  state={property.state}
                  contractType={property.contractType}
                  category={property.category}
                  whatsapp={property.whatsapp ?? null}
                  priceMXN={property.priceMXN ?? null}
                  priceUSD={property.priceUSD ?? null}
                  priceVisible={property.priceVisible}
                  bedrooms={property.bedrooms ?? null}
                  bathrooms={property.bathrooms ?? null}
                  areaSqm={property.areaSqm ?? null}
                  photos={property.photos}
                  featured={property.featured}
                />
              ))}
            </div>
          </>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          basePath="/propiedades"
          searchParams={filtersOnly}
        />
      </div>
    </main>
  )
}
