import { prisma } from '@/lib/prisma'
import LeadsTable from '@/components/admin/LeadsTable'
import { ContactFormEntry } from '@/types'

export default async function LeadsPage() {
  const [active, archived] = await Promise.all([
    prisma.contactForm.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
    prisma.contactForm.findMany({ where: { active: false }, orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light" style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}>Leads</h1>
      </div>
      <LeadsTable leads={active as unknown as ContactFormEntry[]} archived={archived as unknown as ContactFormEntry[]} />
    </div>
  )
}
