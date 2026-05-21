import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import Pagination from '@/components/properties/Pagination'
import type { PaginatedResponse, Property } from '@/types'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
  const qs = new URLSearchParams()
  qs.set('limit', String(limit))
  qs.set('page', page)
  if (contractType) qs.set('contractType', contractType)
  if (category) qs.set('category', category)
  if (city) qs.set('city', city)
  if (minPrice) qs.set('minPrice', minPrice)
  if (maxPrice) qs.set('maxPrice', maxPrice)
  if (bedrooms) qs.set('bedrooms', bedrooms)
  if (search) qs.set('search', search)

  let result: PaginatedResponse<Property> = {
    data: [],
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  }

  try {
    const res = await fetch(`${SITE_URL}/api/properties?${qs.toString()}`, {
      cache: 'no-store',
    })
    if (res.ok) {
      result = await res.json()
    }
  } catch {
    // fetch failed — empty state shown below
  }

  const currentPage = Number(page) || 1

  // searchParams without 'page' for Pagination component
  const { page: _p, ...filtersOnly } = params

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">Propiedades</h1>

        <PropertyFilters
          contractType={contractType ?? undefined}
          category={category ?? undefined}
          city={city ?? undefined}
          minPrice={minPrice ?? undefined}
          maxPrice={maxPrice ?? undefined}
          bedrooms={bedrooms ?? undefined}
          search={search ?? undefined}
        />

        {result.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-2">
            <p className="text-lg font-medium">Sin resultados</p>
            <p className="text-sm">Intenta ajustar los filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {result.total} propiedad{result.total !== 1 ? 'es' : ''} encontrada{result.total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.data.map(property => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  slug={property.slug}
                  city={property.city}
                  state={property.state}
                  contractType={property.contractType}
                  category={property.category}
                  priceMXN={property.priceMXN ?? null}
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
          totalPages={result.totalPages}
          basePath="/propiedades"
          searchParams={filtersOnly}
        />
      </div>
    </main>
  )
}
