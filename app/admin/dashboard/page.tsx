import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
    {
      label: 'Propiedades activas',
      value: activeProperties,
      href: '/admin/propiedades',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: 'Leads pendientes',
      value: pendingLeads,
      href: '/admin/leads',
      urgent: pendingLeads > 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: 'Testimonios pendientes',
      value: pendingTestimonials,
      href: '/admin/testimonios',
      urgent: pendingTestimonials > 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: 'Nuevas este mes',
      value: thisMonthProperties,
      href: '/admin/propiedades',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ]

  const month = now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] uppercase mb-1.5" style={{ color: '#8C7B68' }}>
          {month}
        </p>
        <h1
          className="text-3xl font-light"
          style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}
        >
          Resumen general
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div
              className="rounded-xl p-6 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group"
              style={{
                backgroundColor: '#fff',
                border: stat.urgent ? '1px solid rgba(201,169,110,0.4)' : '1px solid #E8E0D5',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: stat.urgent ? 'rgba(201,169,110,0.12)' : '#F5F0EA',
                    color: stat.urgent ? '#C9A96E' : '#8C7B68',
                  }}
                >
                  {stat.icon}
                </div>
                {stat.urgent && (
                  <span
                    className="text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}
                  >
                    Pendiente
                  </span>
                )}
              </div>
              <div>
                <p
                  className="text-4xl font-light mb-1"
                  style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: '#8C7B68' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#8C7B68' }}>
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ backgroundColor: '#18140D', color: '#C9A96E' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva propiedad
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ backgroundColor: '#EDE8E0', color: '#5C4F42', border: '1px solid #D4C9BC' }}
          >
            Ver leads
          </Link>
          <Link
            href="/admin/testimonios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ backgroundColor: '#EDE8E0', color: '#5C4F42', border: '1px solid #D4C9BC' }}
          >
            Ver testimonios
          </Link>
        </div>
      </div>
    </div>
  )
}
