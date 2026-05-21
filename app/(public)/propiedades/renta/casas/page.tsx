export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function CasasRentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Casas en Renta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Renta', href: '/propiedades/renta' },
      ]}
      defaultContractType="RENT"
      defaultCategory="HOUSE"
      searchParams={params}
      basePath="/propiedades/renta/casas"
    />
  )
}
