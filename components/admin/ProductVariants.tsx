'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Variant {
  id: string
  name: string
  description: string | null
  images: string[]
  active: boolean
}

interface Props {
  productId: string
  variants: Variant[]
}

const emptyForm = { name: '', description: '' }

async function uploadFiles(files: FileList): Promise<string[]> {
  const formData = new FormData()
  formData.append('folder', 'product-images')
  Array.from(files).forEach(f => formData.append('files', f))
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error subiendo imágenes')
  return data.urls as string[]
}

export default function ProductVariants({ productId, variants: initial }: Props) {
  const router = useRouter()
  const [variants, setVariants] = useState(initial)
  const [form, setForm] = useState(emptyForm)
  const [newImages, setNewImages] = useState<string[]>([])
  const [uploadingNew, setUploadingNew] = useState(false)
  const [creating, setCreating] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Variant | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message })
    setTimeout(() => setBanner(null), 3500)
  }

  async function handleNewImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingNew(true)
    try {
      const urls = await uploadFiles(files)
      setNewImages(prev => [...prev, ...urls])
    } catch (err) {
      showBanner('error', err instanceof Error ? err.message : 'Error subiendo imágenes')
    } finally {
      setUploadingNew(false)
      e.target.value = ''
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setCreating(true)
    try {
      const body = { ...form, images: newImages, productId }
      const res = await fetch('/api/admin/variantes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setVariants(prev => [...prev, data])
      setForm(emptyForm)
      setNewImages([])
      showBanner('success', 'Variación creada')
      router.refresh()
    } catch {
      showBanner('error', 'Error inesperado')
    } finally {
      setCreating(false)
    }
  }

  async function handleUploadImages(variantId: string, files: FileList) {
    setUploadingFor(variantId)
    try {
      const urls = await uploadFiles(files)
      const variant = variants.find(v => v.id === variantId)!
      const images = [...variant.images, ...urls]
      const res = await fetch(`/api/admin/variantes/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      })
      const data = await res.json()
      if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
      setVariants(prev => prev.map(v => v.id === variantId ? data : v))
      router.refresh()
    } catch (err) {
      showBanner('error', err instanceof Error ? err.message : 'Error subiendo imágenes')
    } finally {
      setUploadingFor(null)
    }
  }

  async function handleRemoveImage(variant: Variant, url: string) {
    const images = variant.images.filter(u => u !== url)
    const res = await fetch(`/api/admin/variantes/${variant.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    })
    const data = await res.json()
    if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
    setVariants(prev => prev.map(v => v.id === variant.id ? data : v))
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/variantes/${deleteTarget.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { showBanner('error', data.error ?? 'Error'); return }
    setVariants(prev => prev.filter(v => v.id !== deleteTarget.id))
    setDeleteTarget(null)
    showBanner('success', 'Variación eliminada')
    router.refresh()
  }

  function ImageThumb({ url, onRemove }: { url: string; onRemove: () => void }) {
    return (
      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar imagen"
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div>
      {banner && (
        <div className={`mb-3 px-4 py-3 rounded-lg text-sm font-medium ${banner.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {banner.message}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-5">
        {variants.map(v => (
          <div key={v.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex flex-wrap gap-2 shrink-0 sm:w-[220px]">
              {v.images.map(url => (
                <ImageThumb key={url} url={url} onRemove={() => handleRemoveImage(v, url)} />
              ))}
              <label className="flex items-center justify-center w-16 h-16 rounded-lg border border-dashed border-border bg-background text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
                <span className="text-lg leading-none">{uploadingFor === v.id ? '...' : '+'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploadingFor === v.id}
                  onChange={e => { if (e.target.files?.length) handleUploadImages(v.id, e.target.files); e.target.value = '' }}
                />
              </label>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(v)}>Eliminar</Button>
              </div>
              {v.description && (
                <p className="text-xs text-muted-foreground mt-1">{v.description}</p>
              )}
            </div>
          </div>
        ))}
        {variants.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía sin variaciones — este producto se vende tal cual.</p>
        )}
      </div>

      <form onSubmit={handleCreate} className="rounded-xl border border-dashed border-border p-4 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nueva variación</p>

        <input
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
          placeholder="Nombre (ej: Rojo)"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <textarea
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
          placeholder="Descripción (opcional)"
          rows={2}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />

        <div className="flex flex-wrap gap-2">
          {newImages.map(url => (
            <ImageThumb key={url} url={url} onRemove={() => setNewImages(prev => prev.filter(u => u !== url))} />
          ))}
          <label className="flex items-center justify-center w-16 h-16 rounded-lg border border-dashed border-border bg-background text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
            <span className="text-lg leading-none">{uploadingNew ? '...' : '+'}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImageUpload} disabled={uploadingNew} />
          </label>
        </div>

        <Button type="submit" size="sm" disabled={creating || !form.name.trim()} className="bg-primary text-primary-foreground w-fit">
          {creating ? 'Guardando...' : 'Guardar variación'}
        </Button>
      </form>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl bg-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Eliminar variación</h2>
            <p className="text-sm mb-5 text-muted-foreground">
              ¿Confirmás que querés eliminar <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
