import { listContactForms, listProperties, listTestimonials } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'
import type { ContactFormEntry } from '@/types'
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

  const [properties, contactForms, testimonials] = await Promise.all([
    listProperties(),
    listContactForms(),
    listTestimonials(),
  ])
  const activeProperties = properties.filter((property) => property.active).length
  const pendingLeads = contactForms.filter((entry) => entry.status === 'PENDING').length
  const pendingTestimonials = testimonials.filter((entry) => entry.status === 'PENDING').length
  const thisMonthProperties = properties.filter((property) => new Date(property.createdAt).getTime() >= startOfMonth.getTime()).length
  const recentLeads = sortByCreatedAtDescending(contactForms).slice(0, 6)

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
        <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: '#525252' }}>
          {month}
        </p>
        <h1 className="font-heading text-3xl font-medium mb-0.5 text-[#0D1A2D]">
          {getGreeting()}
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>Resumen general del panel</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div
              className="rounded-xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer h-full"
              style={{
                backgroundColor: '#fff',
                border: stat.urgent ? '1px solid #B3B3B3' : '1px solid #B3B3B3',
                borderLeft: stat.urgent ? '3px solid #0D1A2D' : '1px solid #B3B3B3',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: stat.urgent ? 'rgba(13,26,45,0.08)' : '#F8F8F8',
                    color: stat.urgent ? '#0D1A2D' : '#525252',
                  }}
                >
                  {stat.icon}
                </div>
                {stat.urgent && (
                  <span
                    className="text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(13,26,45,0.08)', color: '#0D1A2D' }}
                  >
                    Pendiente
                  </span>
                )}
              </div>
              <div>
                <p
                  className="font-heading text-5xl font-medium leading-none mb-2 text-[#0D1A2D]"
                >
                  {stat.value}
                </p>
                <p className="text-xs font-medium tracking-wide" style={{ color: '#525252' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: '#525252' }}>
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80 text-white"
            style={{ backgroundColor: '#0D1A2D' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva propiedad
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ backgroundColor: '#F8F8F8', color: '#0D1A2D', border: '1px solid #B3B3B3' }}
          >
            Ver leads
          </Link>
          <Link
            href="/admin/testimonios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ backgroundColor: '#F8F8F8', color: '#0D1A2D', border: '1px solid #B3B3B3' }}
          >
            Ver testimonios
          </Link>
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-[0.15em] uppercase" style={{ color: '#525252' }}>
            Leads recientes
          </p>
            <Link href="/admin/leads" className="text-xs font-medium text-[#0D1A2D] transition-colors hover:opacity-70">
            Ver todos →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm"
            style={{ backgroundColor: '#fff', border: '1px solid #B3B3B3', color: '#525252' }}
          >
            No hay leads registrados aún.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #B3B3B3' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F8F8F8', borderBottom: '1px solid #B3B3B3' }}>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#525252' }}>Nombre</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#525252' }}>Teléfono</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide hidden sm:table-cell" style={{ color: '#525252' }}>Tipo</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide" style={{ color: '#525252' }}>Estado</th>
                  <th className="text-right px-5 py-3 font-medium text-xs tracking-wide hidden md:table-cell" style={{ color: '#525252' }}>Recibido</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {recentLeads.map((lead: ContactFormEntry, i: number) => (
                  <tr key={lead.id} style={{ borderBottom: i < recentLeads.length - 1 ? '1px solid #F8F8F8' : 'none' }}>
                    <td className="px-5 py-3.5 font-medium" style={{ color: '#0D1A2D' }}>{lead.name ?? '—'}</td>
                    <td className="px-5 py-3.5" style={{ color: '#525252' }}>{lead.phone}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell" style={{ color: '#525252' }}>{TYPE_LABEL[lead.type] ?? lead.type}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
                        style={
                          lead.status === 'PENDING'
                            ? { backgroundColor: 'rgba(13,26,45,0.08)', color: '#0D1A2D' }
                            : lead.status === 'CONTACTED'
                            ? { backgroundColor: 'rgba(100,160,120,0.12)', color: '#3A8A5A' }
                            : { backgroundColor: '#F8F8F8', color: '#525252' }
                        }
                      >
                        {STATUS_LABEL[lead.status] ?? lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell text-xs" style={{ color: '#525252' }}>
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
