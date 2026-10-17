import { listProperties } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'
import PropertiesTable from '@/components/admin/PropertiesTable'
import { Property } from '@/types'

export default async function PropiedadesPage() {
  const properties = sortByCreatedAtDescending(await listProperties())
  const active = properties.filter((property) => property.active)
  const archived = properties.filter((property) => !property.active)

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="font-heading text-3xl font-medium text-[#0D1A2D]">Propiedades</h1>
      </div>
      <PropertiesTable properties={active as unknown as Property[]} archived={archived as unknown as Property[]} />
    </div>
  )
}
