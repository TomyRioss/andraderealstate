export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function TorrenosVentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Terrenos en Venta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Venta', href: '/propiedades/venta' },
      ]}
      defaultContractType="SALE"
      defaultCategory="LAND"
      searchParams={params}
      basePath="/propiedades/venta/terrenos"
    />
  )
}
