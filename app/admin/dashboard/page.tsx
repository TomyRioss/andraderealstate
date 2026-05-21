import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeProperties, pendingLeads, pendingTestimonials, thisMonthProperties] =
    await Promise.all([
      prisma.property.count({ where: { active: true } }),
      prisma.contactForm.count({ where: { status: 'PENDING' } }),
      prisma.testimonial.count({ where: { status: 'PENDING' } }),
      prisma.property.count({ where: { createdAt: { gte: startOfMonth } } }),
    ])

  const stats = [
    { label: 'Propiedades activas', value: activeProperties },
    { label: 'Leads pendientes', value: pendingLeads },
    { label: 'Testimonios pendientes', value: pendingTestimonials },
    { label: 'Propiedades este mes', value: thisMonthProperties },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-start gap-2"
          >
            <span className="text-4xl font-bold text-[#1e3a5f]">{stat.value}</span>
            <span className="text-sm text-slate-500">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
