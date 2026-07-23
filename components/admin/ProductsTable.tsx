'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  featured: boolean
  category: { id: string; name: string }
  subcategory: { id: string; name: string } | null
  _count: { variants: number }
  createdAt: string
}

interface Props {
  products: Product[]
}

export default function ProductsTable({ products: initial }: Props) {
  const router = useRouter()
  const [products, setProducts] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message })
    setTimeout(() => setBanner(null), 3500)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/productos/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
      showBanner('success', 'Producto eliminado')
      setDeleteTarget(null)
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {banner && (
        <div className={`mx-6 mb-3 px-4 py-3 rounded-lg text-sm font-medium ${banner.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {banner.message}
        </div>
      )}

      <div className="px-6 mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{products.length} producto{products.length !== 1 ? 's' : ''}</span>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="px-6 overflow-x-auto">
        <table className="w-full text-sm rounded-xl overflow-hidden border border-border border-separate border-spacing-0">
          <thead>
            <tr className="bg-muted">
              {['Nombre', 'Categoría', 'Subcategoría', 'Variaciones', 'Estado', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-xs tracking-wide text-muted-foreground first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card">
            {products.map((p, i) => (
              <tr key={p.id} className={`group hover:bg-muted/50 transition-colors ${i < products.length - 1 ? 'border-b border-border' : ''}`}>
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.subcategory?.name ?? <span className="text-muted-foreground/50">—</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p._count.variants > 0 ? p._count.variants : <span className="text-muted-foreground/50">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${p.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-[0.8rem] font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors"
                    >
                      Editar
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(p)}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Sin productos todavía. Creá el primero con el botón de arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl bg-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Eliminar producto</h2>
            <p className="text-sm mb-5 text-muted-foreground">
              ¿Confirmás que querés eliminar <strong>{deleteTarget.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={loading} onClick={handleDelete}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
