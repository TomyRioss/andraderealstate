'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Property } from '@/types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface Props {
  properties: Property[]
}

export default function PropertiesTable({ properties: initial }: Props) {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(id: string, field: 'active' | 'featured', current: boolean) {
    setLoading(`${id}-${field}`)
    try {
      const res = await fetch(`${BASE}/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: !current } : p))
      )
    } catch {
      alert('Error al actualizar propiedad')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    setLoading(`${id}-delete`)
    try {
      const res = await fetch(`${BASE}/api/properties/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Error al eliminar propiedad')
    } finally {
      setLoading(null)
    }
  }

  const fmt = (n?: number | null) =>
    n != null ? `$${n.toLocaleString('es-MX')}` : '—'

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1e3a5f] text-white">
              {['Título', 'Ciudad', 'Tipo', 'Precio MXN', 'Activa', 'Destacada', 'Acciones'].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {properties.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-slate-600">{p.city}</td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3 text-slate-600">{fmt(p.priceMXN)}</td>
                <td className="px-4 py-3">
                  <button
                    disabled={loading === `${p.id}-active`}
                    onClick={() => toggle(p.id, 'active', p.active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
                      ${p.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {p.active ? 'Sí' : 'No'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={loading === `${p.id}-featured`}
                    onClick={() => toggle(p.id, 'featured', p.featured)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
                      ${p.featured ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {p.featured ? 'Sí' : 'No'}
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/propiedades/${p.id}`)}
                  >
                    Editar
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
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Sin propiedades
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="font-semibold text-slate-800">{p.title}</div>
            <div className="text-xs text-slate-500">
              {p.city} · {p.category} · {fmt(p.priceMXN)}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggle(p.id, 'active', p.active)}
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
              >
                Activa: {p.active ? 'Sí' : 'No'}
              </button>
              <button
                onClick={() => toggle(p.id, 'featured', p.featured)}
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${p.featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
              >
                Destacada: {p.featured ? 'Sí' : 'No'}
              </button>
            </div>
            <div className="flex gap-2 mt-1">
              <Button size="sm" variant="outline" onClick={() => router.push(`/admin/propiedades/${p.id}`)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <div className="text-center text-slate-400 py-8">Sin propiedades</div>
        )}
      </div>
    </>
  )
}
