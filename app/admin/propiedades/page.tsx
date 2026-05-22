import { prisma } from '@/lib/prisma'
import PropertiesTable from '@/components/admin/PropertiesTable'
import { Property } from '@/types'

export default async function PropiedadesPage() {
  const [active, archived] = await Promise.all([
    prisma.property.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
    prisma.property.findMany({ where: { active: false }, orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light" style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}>Propiedades</h1>
      </div>
      <PropertiesTable properties={active as unknown as Property[]} archived={archived as unknown as Property[]} />
    </div>
  )
}
