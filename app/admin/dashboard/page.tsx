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

export default async function DashboardPage() {
  const now = new Date()

  const [productCount, categoryCount, userCount, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, active: true, featured: true, createdAt: true, category: { select: { name: true } } },
    }),
  ])

  const stats = [
    {
      label: 'Productos',
      value: productCount,
      href: '/admin/productos',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: 'Categorías',
      value: categoryCount,
      href: '/admin/categorias',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Usuarios admin',
      value: userCount,
      href: '/admin/usuarios',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ]

  const month = now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] uppercase mb-1 text-muted-foreground">{month}</p>
        <h1 className="text-3xl font-light mb-0.5 text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
          {getGreeting()}
        </h1>
        <p className="text-sm text-muted-foreground">Resumen general del panel</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer h-full bg-card border border-border">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-5xl font-light leading-none mb-2 text-primary" style={{ fontFamily: 'Georgia, serif' }}>
                  {stat.value}
                </p>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] uppercase mb-4 text-muted-foreground">Acciones rápidas</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80 bg-primary text-primary-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo producto
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80 bg-muted text-foreground border border-border"
          >
            Ver categorías
          </Link>
          <Link
            href="/admin/usuarios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80 bg-muted text-foreground border border-border"
          >
            Ver usuarios
          </Link>
        </div>
      </div>

      {/* Recent products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Productos recientes</p>
          <Link href="/admin/productos" className="text-xs font-medium transition-colors hover:opacity-70 text-secondary">
            Ver todos →
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="rounded-xl p-8 text-center text-sm bg-card border border-border text-muted-foreground">
            No hay productos registrados aún.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide text-muted-foreground">Nombre</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide hidden sm:table-cell text-muted-foreground">Categoría</th>
                  <th className="text-left px-5 py-3 font-medium text-xs tracking-wide text-muted-foreground">Estado</th>
                  <th className="text-right px-5 py-3 font-medium text-xs tracking-wide hidden md:table-cell text-muted-foreground">Creado</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {recentProducts.map((product, i) => (
                  <tr key={product.id} className={i < recentProducts.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-5 py-3.5 font-medium text-foreground">{product.name}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-muted-foreground">{product.category.name}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          product.active
                            ? 'text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500'
                            : 'text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-muted text-muted-foreground'
                        }
                      >
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell text-xs text-muted-foreground">
                      {timeAgo(new Date(product.createdAt))}
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
