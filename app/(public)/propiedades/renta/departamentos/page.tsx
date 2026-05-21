export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function DepartamentosRentaPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Departamentos en Renta"
      breadcrumb={[
        { label: 'Propiedades', href: '/propiedades' },
        { label: 'Renta', href: '/propiedades/renta' },
      ]}
      defaultContractType="RENT"
      defaultCategory="APARTMENT"
      searchParams={params}
      basePath="/propiedades/renta/departamentos"
    />
  )
}
