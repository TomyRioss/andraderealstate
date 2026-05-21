export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function VentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Propiedades en Venta"
      breadcrumb={[{ label: 'Propiedades', href: '/propiedades' }]}
      defaultContractType="SALE"
      searchParams={params}
      basePath="/propiedades/venta"
    />
  )
}
