export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function CasasVentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Casas en Venta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Venta', href: '/propiedades/venta' },
      ]}
      defaultContractType="SALE"
      defaultCategory="HOUSE"
      searchParams={params}
      basePath="/propiedades/venta/casas"
    />
  )
}
