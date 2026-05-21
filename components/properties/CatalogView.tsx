import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters, { CategoryOption } from '@/components/properties/PropertyFilters'
import Pagination from '@/components/properties/Pagination'
import type { PaginatedResponse, Property } from '@/types'
import Link from 'next/link'

const CATEGORIES_VENTA: CategoryOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'LAND', label: 'Terreno' },
]

const CATEGORIES_RENTA: CategoryOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'COMMERCIAL', label: 'Oficina' },
]

function getAllowedCategories(contractType?: string): CategoryOption[] | undefined {
  if (contractType === 'SALE') return CATEGORIES_VENTA
  if (contractType === 'RENT') return CATEGORIES_RENTA
  return undefined
}

interface CatalogViewProps {
  title: string
  breadcrumb?: { label: string; href: string }[]
  defaultContractType?: string
  defaultCategory?: string
  searchParams: Record<string, string>
  basePath: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function CatalogView({
  title,
  breadcrumb,
  defaultContractType,
  defaultCategory,
  searchParams,
  basePath,
}: CatalogViewProps) {
  const { city, minPrice, maxPrice, bedrooms, search, page = '1' } = searchParams

  const limit = 12
  const qs = new URLSearchParams()
  qs.set('limit', String(limit))
  qs.set('page', page)
  qs.set('contractType', defaultContractType ?? '')
  if (defaultCategory) qs.set('category', defaultCategory)
  if (city) qs.set('city', city)
  if (minPrice) qs.set('minPrice', minPrice)
  if (maxPrice) qs.set('maxPrice', maxPrice)
  if (bedrooms) qs.set('bedrooms', bedrooms)
  if (search) qs.set('search', search)

  let result: PaginatedResponse<Property> = { data: [], total: 0, page: 1, limit, totalPages: 0 }

  try {
    const res = await fetch(`${SITE_URL}/api/properties?${qs.toString()}`, { cache: 'no-store' })
    if (res.ok) result = await res.json()
  } catch {
    // empty state shown below
  }

  const currentPage = Number(page) || 1
  const { page: _p, ...filtersOnly } = searchParams

  return (
    <main className="min-h-screen bg-[#F7F3EE]">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Breadcrumb */}
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-xs text-[#A89880]">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <Link href={crumb.href} className="hover:text-[#B07030] transition-colors">
                  {crumb.label}
                </Link>
              </span>
            ))}
            <span>/</span>
            <span className="text-[#18140D] font-medium">{title}</span>
          </nav>
        )}

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl text-[#18140D] leading-tight"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          {title}
        </h1>

        {/* Filters — hide locked filters (contractType, category) */}
        <PropertyFilters
          city={city ?? undefined}
          minPrice={minPrice ?? undefined}
          maxPrice={maxPrice ?? undefined}
          bedrooms={bedrooms ?? undefined}
          search={search ?? undefined}
          basePath={basePath}
          hiddenContractType={defaultContractType}
          hiddenCategory={defaultCategory}
          allowedCategories={getAllowedCategories(defaultContractType)}
        />

        {result.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#A89880] space-y-2">
            <p className="text-lg font-medium">Sin resultados</p>
            <p className="text-sm">Intenta ajustar los filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#A89880]">
              {result.total} propiedad{result.total !== 1 ? 'es' : ''} encontrada{result.total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.data.map(p => (
                <PropertyCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  slug={p.slug}
                  city={p.city}
                  state={p.state}
                  contractType={p.contractType}
                  category={p.category}
                  priceMXN={p.priceMXN ?? null}
                  priceVisible={p.priceVisible}
                  bedrooms={p.bedrooms ?? null}
                  bathrooms={p.bathrooms ?? null}
                  areaSqm={p.areaSqm ?? null}
                  photos={p.photos}
                  featured={p.featured}
                />
              ))}
            </div>
          </>
        )}

        <Pagination page={currentPage} totalPages={result.totalPages} basePath={basePath} searchParams={filtersOnly} />
      </div>
    </main>
  )
}
