import { listContactForms } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'
import LeadsTable from '@/components/admin/LeadsTable'
import { ContactFormEntry } from '@/types'

export default async function LeadsPage() {
  const entries = sortByCreatedAtDescending(await listContactForms())
  const active = entries.filter((entry) => entry.active)
  const archived = entries.filter((entry) => !entry.active)

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="font-heading text-3xl font-medium text-[#0D1A2D]">Leads</h1>
      </div>
      <LeadsTable leads={active as unknown as ContactFormEntry[]} archived={archived as unknown as ContactFormEntry[]} />
    </div>
  )
}
