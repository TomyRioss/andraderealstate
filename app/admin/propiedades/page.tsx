import { prisma } from '@/lib/prisma'
import PropertiesTable from '@/components/admin/PropertiesTable'
import { Property } from '@/types'

export default async function PropiedadesPage() {
  const rows = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } })
  const properties = rows as unknown as Property[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Propiedades</h1>
      <PropertiesTable properties={properties} />
    </div>
  )
}
