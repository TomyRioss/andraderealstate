export const dynamic = 'force-dynamic'

import CatalogView from '@/components/properties/CatalogView'

interface PageProps { searchParams: Promise<Record<string, string>> }

export default async function DesarrollosPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <CatalogView
      title="Desarrollos"
      breadcrumb={[{ label: 'Propiedades', href: '/propiedades' }]}
      defaultContractType="DEVELOPMENT"
      searchParams={params}
      basePath="/propiedades/desarrollos"
    />
  )
}
