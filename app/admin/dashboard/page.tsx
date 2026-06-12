import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  CONTACTED: 'Contactado',
  CLOSED: 'Cerrado',
  DISCARDED: 'Descartado',
}

const TYPE_LABEL: Record<string, string> = {
  BUY: 'Compra',
  SELL: 'Venta',
  MANAGE: 'Gestión',
}

export default async function DashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeProperties, pendingLeads, pendingTestimonials, thisMonthProperties, recentLeads] =
    await Promise.all([
      prisma.property.count({ where: { active: true } }),
      prisma.contactForm.count({ where: { status: 'PENDING' } }),
      prisma.testimonial.count({ where: { status: 'PENDING' } }),
      prisma.property.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contactForm.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { id: true, name: true, phone: true, type: true, status: true, createdAt: true },
      }),
    ])

  const stats = [
    {
      label: 'Propiedades activas',
      value: activeProperties,
      href: '/admin/propiedades',
      urgent: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: 'Nuevas este mes',
      value: thisMonthProperties,
      href: '/admin/propiedades',
      urgent: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
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
        <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: '#4A7BA7' }}>
          {month}
        </p>
        <h1 className="text-3xl font-light mb-0.5" style={{ color: '#0D3B66', fontFamily: 'Georgia, serif' }}>
          {getGreeting()}
        </h1>
        <p className="text-sm" style={{ color: '#4A7BA7' }}>Resumen general del panel</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div
              className="rounded-xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer h-full"
              style={{
                backgroundColor: '#fff',
                border: stat.urgent ? '1px solid #AED6F1' : '1px solid #AED6F1',
                borderLeft: stat.urgent ? '3px solid #1A5F9E' : '1px solid #AED6F1',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: stat.urgent ? 'rgba(26,95,158,0.1)' : '#E8F4FD',
                    color: stat.urgent ? '#1A5F9E' : '#4A7BA7',
                  }}
                >
                  {stat.icon}
                </div>
                {stat.urgent && (
                  <span
                    className="text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(26,95,158,0.1)', color: '#1A5F9E' }}
                  >
                    Pendiente
                  </span>
                )}
              </div>
              <div>
                <p
                  className="text-5xl font-light leading-none mb-2"
                  style={{ color: stat.urgent ? '#1A5F9E' : '#0D3B66', fontFamily: 'Georgia, serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-medium tracking-wide" style={{ color: '#4A7BA7' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#4A7BA7' }}>
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80 text-white"
            style={{ backgroundColor: '#0D3B66' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva propiedad
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ backgroundColor: '#E8F4FD', color: '#0D3B66', border: '1px solid #AED6F1' }}
          >
            Ver leads
          </Link>
          <Link
            href="/admin/testimonios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ backgroundColor: '#E8F4FD', color: '#0D3B66', border: '1px solid #AED6F1' }}
          >
            Ver testimonios
          </Link>
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-[0.15em] uppercase" style={{ color: '#4A7BA7' }}>
            Leads recientes
          </p>
          <Link href="/admin/leads" className="text-xs font-medium transition-colors hover:opacity-70" style={{ color: '#1A5F9E' }}>
            Ver todos →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm"
            style={{ backgroundColor: '#fff', border: '1px solid #AED6F1', color: '#4A7BA7' }}
          >
            No hay leads registrados aún.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #AED6F1' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#E8F4FD', borderBottom: '1px solid #AED6F1' }}>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#4A7BA7' }}>Nombre</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#4A7BA7' }}>Teléfono</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide hidden sm:table-cell" style={{ color: '#4A7BA7' }}>Tipo</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#4A7BA7' }}>Estado</th>
                  <th className="text-right px-5 py-3 font-medium text-xs tracking-wide hidden md:table-cell" style={{ color: '#4A7BA7' }}>Recibido</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {recentLeads.map((lead, i) => (
                  <tr key={lead.id} style={{ borderBottom: i < recentLeads.length - 1 ? '1px solid #E8F4FD' : 'none' }}>
                    <td className="px-5 py-3.5 font-medium" style={{ color: '#0D3B66' }}>{lead.name ?? '—'}</td>
                    <td className="px-5 py-3.5" style={{ color: '#4A7BA7' }}>{lead.phone}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell" style={{ color: '#4A7BA7' }}>{TYPE_LABEL[lead.type] ?? lead.type}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
                        style={
                          lead.status === 'PENDING'
                            ? { backgroundColor: 'rgba(26,95,158,0.1)', color: '#1A5F9E' }
                            : lead.status === 'CONTACTED'
                            ? { backgroundColor: 'rgba(100,160,120,0.12)', color: '#3A8A5A' }
                            : { backgroundColor: '#E8F4FD', color: '#4A7BA7' }
                        }
                      >
                        {STATUS_LABEL[lead.status] ?? lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell text-xs" style={{ color: '#4A7BA7' }}>
                      {timeAgo(new Date(lead.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
