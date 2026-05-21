export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function OficinasRentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Oficinas en Renta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Renta', href: '/propiedades/renta' },
      ]}
      defaultContractType="RENT"
      defaultCategory="COMMERCIAL"
      searchParams={params}
      basePath="/propiedades/renta/oficinas"
    />
  )
}
