export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function RentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Propiedades en Renta"
      breadcrumb={[{ label: 'Propiedades', href: '/propiedades' }]}
      defaultContractType="RENT"
      searchParams={params}
      basePath="/propiedades/renta"
    />
  )
}
