'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Property } from '@/types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type SortKey = 'title' | 'city' | 'category' | 'priceMXN' | 'featured'
type SortDir = 'asc' | 'desc'
type Tab = 'active' | 'archived'

interface Props {
  properties: Property[]
  archived: Property[]
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="inline-flex flex-col ml-1 opacity-60">
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"
        className={active && dir === 'asc' ? 'opacity-100' : 'opacity-30'}>
        <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"
        className={active && dir === 'desc' ? 'opacity-100' : 'opacity-30'}>
        <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
      </svg>
    </span>
  )
}

export default function PropertiesTable({ properties: initial, archived: initialArchived }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('active')
  const [properties, setProperties] = useState<Property[]>(initial)
  const [archived, setArchived] = useState<Property[]>(initialArchived)
  const [loading, setLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const list = tab === 'active' ? properties : archived

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const displayed = useMemo(() => {
    const q = search.toLowerCase().trim()
    const filtered = q
      ? list.filter((p) => p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q))
      : list
    return [...filtered].sort((a, b) => {
      let av: string | number | boolean = a[sortKey] ?? ''
      let bv: string | number | boolean = b[sortKey] ?? ''
      if (typeof av === 'boolean') av = av ? 1 : 0
      if (typeof bv === 'boolean') bv = bv ? 1 : 0
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [list, search, sortKey, sortDir])

  async function toggleFeatured(id: string, current: boolean) {
    setLoading(`${id}-featured`)
    try {
      const res = await fetch(`${BASE}/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      })
      if (!res.ok) throw new Error()
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)))
    } catch {
      alert('Error al actualizar propiedad')
    } finally {
      setLoading(null)
    }
  }

  async function toggleArchive(p: Property) {
    const next = !p.active
    setLoading(`${p.id}-archive`)
    try {
      const res = await fetch(`${BASE}/api/properties/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) throw new Error()
      if (next === false) {
        setProperties((prev) => prev.filter((x) => x.id !== p.id))
        setArchived((prev) => [{ ...p, active: false }, ...prev])
      } else {
        setArchived((prev) => prev.filter((x) => x.id !== p.id))
        setProperties((prev) => [{ ...p, active: true }, ...prev])
      }
    } catch {
      alert('Error al archivar propiedad')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    setLoading(`${id}-delete`)
    try {
      const res = await fetch(`${BASE}/api/properties/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setProperties((prev) => prev.filter((p) => p.id !== id))
      setArchived((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Error al eliminar propiedad')
    } finally {
      setLoading(null)
    }
  }

  const fmt = (n?: number | null) =>
    n != null ? `$${n.toLocaleString('es-MX')}` : '—'

  const cols: { key: SortKey; label: string }[] = [
    { key: 'title', label: 'Título' },
    { key: 'city', label: 'Ciudad' },
    { key: 'category', label: 'Tipo' },
    { key: 'priceMXN', label: 'Precio MXN' },
    { key: 'featured', label: 'Destacada' },
  ]

  return (
    <>
      {/* Tabs + search */}
      <div className="px-6 pb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex gap-2 items-center">
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#C9A96E', color: '#fff' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva
          </Link>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === 'active' ? 'bg-[#18140D] text-[#C9A96E]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Activas <span className="ml-1 opacity-70">({properties.length})</span>
          </button>
          <button
            onClick={() => setTab('archived')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === 'archived' ? 'bg-[#18140D] text-[#C9A96E]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Archivadas <span className="ml-1 opacity-70">({archived.length})</span>
          </button>
        </div>
        <div className="relative max-w-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B68]">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID o título…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DDD5] bg-white text-sm text-[#18140D] focus:outline-none focus:border-[#C9A96E] transition-colors"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#18140D] text-[#C9A96E]">
              {cols.map(({ key, label }) => (
                <th key={key}
                  className="px-4 py-3 text-left font-semibold cursor-pointer select-none whitespace-nowrap hover:text-[#E8C98A] transition-colors"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  <SortIcon active={sortKey === key} dir={sortDir} />
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.city}</td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3 text-slate-600">{fmt(p.priceMXN)}</td>
                <td className="px-4 py-3">
                  {tab === 'active' ? (
                    <button
                      disabled={loading === `${p.id}-featured`}
                      onClick={() => toggleFeatured(p.id, p.featured)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
                        ${p.featured ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {p.featured ? 'Sí' : 'No'}
                    </button>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.featured ? 'Sí' : 'No'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {tab === 'active' && (
                    <Button size="sm" variant="outline" onClick={() => router.push(`/admin/propiedades/${p.id}`)}>
                      Editar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-slate-500"
                    disabled={loading === `${p.id}-archive`}
                    onClick={() => toggleArchive(p)}
                  >
                    {tab === 'active' ? 'Archivar' : 'Restaurar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading === `${p.id}-delete`}
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  {search ? 'Sin resultados' : tab === 'active' ? 'Sin propiedades activas' : 'Sin propiedades archivadas'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3 px-4">
        {displayed.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="font-semibold text-slate-800">{p.title}</div>
            <div className="text-xs text-slate-500">
              {p.city} · {p.category} · {fmt(p.priceMXN)}
            </div>
            {tab === 'active' && (
              <button
                onClick={() => toggleFeatured(p.id, p.featured)}
                className={`self-start px-3 py-1 rounded-full text-xs font-semibold
                  ${p.featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
              >
                Destacada: {p.featured ? 'Sí' : 'No'}
              </button>
            )}
            <div className="flex gap-2 mt-1 flex-wrap">
              {tab === 'active' && (
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/propiedades/${p.id}`)}>
                  Editar
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => toggleArchive(p)}>
                {tab === 'active' ? 'Archivar' : 'Restaurar'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            {search ? 'Sin resultados' : tab === 'active' ? 'Sin propiedades activas' : 'Sin propiedades archivadas'}
          </div>
        )}
      </div>
    </>
  )
}
