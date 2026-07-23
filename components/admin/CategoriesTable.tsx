'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Subcategory {
  id: string
  name: string
  slug: string
  order: number
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  active: boolean
  order: number
  subcategories: Subcategory[]
}

interface Props {
  categories: Category[]
}

const emptyCategoryForm = { name: '', slug: '', icon: '' }
const emptySubForm = { name: '', slug: '' }

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoriesTable({ categories: initial }: Props) {
  const router = useRouter()
  const [categories, setCategories] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyCategoryForm)
  const [subForm, setSubForm] = useState(emptySubForm)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteSubTarget, setDeleteSubTarget] = useState<{ categoryId: string; sub: Subcategory } | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message })
    setTimeout(() => setBanner(null), 3500)
  }

  function openCreate() {
    setForm(emptyCategoryForm)
    setSelected(null)
    setModal('create')
  }

  function openEdit(c: Category) {
    setForm({ name: c.name, slug: c.slug, icon: c.icon ?? '' })
    setSelected(c)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const isEdit = modal === 'edit'
      const url = isEdit ? `/api/admin/categorias/${selected!.id}` : '/api/admin/categorias'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = { ...form, slug: form.slug || slugify(form.name) }

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }

      if (isEdit) {
        setCategories(prev => prev.map(c => c.id === data.id ? { ...data } : c))
        showBanner('success', 'Categoría actualizada')
      } else {
        setCategories(prev => [...prev, data])
        showBanner('success', 'Categoría creada')
      }
      closeModal()
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categorias/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id))
      showBanner('success', 'Categoría eliminada')
      setDeleteTarget(null)
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddSubcategory(categoryId: string) {
    if (!subForm.name.trim()) return
    setLoading(true)
    try {
      const body = { ...subForm, slug: subForm.slug || slugify(subForm.name), categoryId }
      const res = await fetch('/api/admin/subcategorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, subcategories: [...c.subcategories, data] } : c))
      setSubForm(emptySubForm)
      showBanner('success', 'Subcategoría creada')
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteSubcategory() {
    if (!deleteSubTarget) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/subcategorias/${deleteSubTarget.sub.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setCategories(prev => prev.map(c => c.id === deleteSubTarget.categoryId
        ? { ...c, subcategories: c.subcategories.filter(s => s.id !== deleteSubTarget.sub.id) }
        : c))
      showBanner('success', 'Subcategoría eliminada')
      setDeleteSubTarget(null)
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
        <span className="text-sm text-muted-foreground">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</span>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:opacity-80">
          + Nueva categoría
        </Button>
      </div>

      <div className="px-6 flex flex-col gap-3">
        {categories.map(c => {
          const isOpen = expanded === c.id
          return (
            <div
              key={c.id}
              className={`rounded-xl overflow-hidden bg-card border transition-colors ${isOpen ? 'border-primary/40' : 'border-border'}`}
            >
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <button
                  className="flex items-center gap-3 text-left flex-1 min-w-0 group/row"
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                >
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  <span className="text-foreground font-medium truncate group-hover/row:text-primary transition-colors">{c.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">/{c.slug}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                    {c.subcategories.length} subcategoría{c.subcategories.length !== 1 ? 's' : ''}
                  </span>
                </button>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(c)}>Eliminar</Button>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-border pt-4 bg-muted/40">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.subcategories.map(s => (
                      <div key={s.id} className="group flex items-center gap-2 text-sm bg-background border border-border rounded-full pl-3 pr-1.5 py-1">
                        <span className="text-foreground">{s.name}</span>
                        <span className="text-muted-foreground text-xs">/{s.slug}</span>
                        <button
                          onClick={() => setDeleteSubTarget({ categoryId: c.id, sub: s })}
                          aria-label={`Eliminar ${s.name}`}
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {c.subcategories.length === 0 && (
                      <p className="text-sm text-muted-foreground py-1">Todavía sin subcategorías</p>
                    )}
                  </div>
                  <form
                    className="flex gap-2"
                    onSubmit={e => { e.preventDefault(); handleAddSubcategory(c.id) }}
                  >
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground placeholder:text-muted-foreground transition-shadow"
                      placeholder="Nombre de la subcategoría"
                      value={subForm.name}
                      onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <Button type="submit" size="sm" disabled={loading || !subForm.name.trim()} className="bg-primary text-primary-foreground shrink-0">
                      + Agregar
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )
        })}
        {categories.length === 0 && (
          <div className="text-center text-muted-foreground py-12 rounded-xl border border-dashed border-border">
            Sin categorías todavía. Creá la primera con el botón de arriba.
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-xl bg-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-5 text-foreground">
              {modal === 'create' ? 'Nueva categoría' : 'Editar categoría'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Nombre *</label>
                <input
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Cristalería"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Slug (vacío = auto)</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="cristaleria"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Icono (opcional)</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="wine"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete category confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl bg-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Eliminar categoría</h2>
            <p className="text-sm mb-5 text-muted-foreground">
              ¿Confirmás que querés eliminar <strong>{deleteTarget.name}</strong>? Se eliminan también sus subcategorías. Esta acción no se puede deshacer.
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

      {/* Delete subcategory confirm */}
      {deleteSubTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteSubTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl bg-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Eliminar subcategoría</h2>
            <p className="text-sm mb-5 text-muted-foreground">
              ¿Confirmás que querés eliminar <strong>{deleteSubTarget.sub.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteSubTarget(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={loading} onClick={handleDeleteSubcategory}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
