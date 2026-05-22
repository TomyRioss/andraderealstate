export const dynamic = 'force-dynamic'

import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import Pagination from '@/components/properties/Pagination'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

  const where: Prisma.PropertyWhereInput = { active: true }
  if (contractType) where.contractType = contractType as never
  if (category) where.category = category as never
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms, 10) }
  if (minPrice || maxPrice) {
    where.priceMXN = {}
    if (minPrice) (where.priceMXN as Prisma.FloatNullableFilter).gte = parseFloat(minPrice)
    if (maxPrice) (where.priceMXN as Prisma.FloatNullableFilter).lte = parseFloat(maxPrice)
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.property.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)
  const { page: _p, ...filtersOnly } = params

  return (
    <main className="min-h-screen bg-[#f5f4f0]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Propiedades</h1>

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
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-2">
            <p className="text-lg font-medium">Sin resultados</p>
            <p className="text-sm">Intenta ajustar los filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {total} propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map(property => (
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
