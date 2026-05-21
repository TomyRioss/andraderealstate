export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function DepartamentosVentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Departamentos en Venta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Venta', href: '/propiedades/venta' },
      ]}
      defaultContractType="SALE"
      defaultCategory="APARTMENT"
      searchParams={params}
      basePath="/propiedades/venta/departamentos"
    />
  )
}
