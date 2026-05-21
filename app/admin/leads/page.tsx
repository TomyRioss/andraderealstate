import { prisma } from '@/lib/prisma'
import LeadsTable from '@/components/admin/LeadsTable'
import { ContactFormEntry } from '@/types'

export default async function LeadsPage() {
  const rows = await prisma.contactForm.findMany({ orderBy: { createdAt: 'desc' } })
  const leads = rows as unknown as ContactFormEntry[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Leads</h1>
      <LeadsTable leads={leads} />
    </div>
  )
}
