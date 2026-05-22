'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { ContractType, Category, Property } from '@/types'

interface FormState {
  title: string
  slug: string
  description: string
  contractType: ContractType
  category: Category
  priceMXN: string
  priceUSD: string
  priceVisible: boolean
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms: string
  bathrooms: string
  halfBaths: string
  parkingSpots: string
  areaSqm: string
  landAreaSqm: string
  floors: string
  yearBuilt: string
  amenities: string
  features: string
  whatsapp: string
  active: boolean
  featured: boolean
  videoUrl: string
}

function propToForm(p: Property): FormState {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    contractType: p.contractType,
    category: p.category,
    priceMXN: p.priceMXN != null ? String(p.priceMXN) : '',
    priceUSD: p.priceUSD != null ? String(p.priceUSD) : '',
    priceVisible: p.priceVisible,
    address: p.address,
    city: p.city,
    state: p.state,
    zipCode: p.zipCode ?? '',
    bedrooms: p.bedrooms != null ? String(p.bedrooms) : '',
    bathrooms: p.bathrooms != null ? String(p.bathrooms) : '',
    halfBaths: p.halfBaths != null ? String(p.halfBaths) : '',
    parkingSpots: p.parkingSpots != null ? String(p.parkingSpots) : '',
    areaSqm: p.areaSqm != null ? String(p.areaSqm) : '',
    landAreaSqm: p.landAreaSqm != null ? String(p.landAreaSqm) : '',
    floors: p.floors != null ? String(p.floors) : '',
    yearBuilt: p.yearBuilt != null ? String(p.yearBuilt) : '',
    amenities: p.amenities.join(', '),
    features: p.features.join(', '),
    whatsapp: p.whatsapp ?? '',
    active: p.active,
    featured: p.featured,
    videoUrl: p.videoUrl ?? '',
  }
}

export default function EditPropiedad() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState<FormState | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(r => r.json())
      .then((p: Property) => {
        setForm(propToForm(p))
        setPhotos(p.photos ?? [])
      })
      .catch(() => setError('No se pudo cargar la propiedad'))
      .finally(() => setLoading(false))
  }, [id])

  const set = useCallback(
    (field: keyof FormState, value: string | boolean) =>
      setForm(prev => prev ? { ...prev, [field]: value } : prev),
    []
  )

  async function handlePhotos(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    const supabase = createClient()
    try {
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `properties/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage
          .from('property-images')
          .upload(path, file)
        if (upErr) throw new Error(upErr.message)
        const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path)
        setPhotos(prev => [...prev, pub.publicUrl])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(path: string) {
    setPhotos(prev => prev.filter(p => p !== path))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    try {
      const body = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        contractType: form.contractType,
        category: form.category,
        priceMXN: form.priceMXN ? Number(form.priceMXN) : undefined,
        priceUSD: form.priceUSD ? Number(form.priceUSD) : undefined,
        priceVisible: form.priceVisible,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode || undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        halfBaths: form.halfBaths ? Number(form.halfBaths) : undefined,
        parkingSpots: form.parkingSpots ? Number(form.parkingSpots) : undefined,
        areaSqm: form.areaSqm ? Number(form.areaSqm) : undefined,
        landAreaSqm: form.landAreaSqm ? Number(form.landAreaSqm) : undefined,
        floors: form.floors ? Number(form.floors) : undefined,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
        whatsapp: form.whatsapp || undefined,
        active: form.active,
        featured: form.featured,
        videoUrl: form.videoUrl || undefined,
        photos,
      }
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al guardar')
      }
      router.push('/admin/propiedades')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white'
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1'
  const sectionCls = 'bg-gray-50 rounded-lg p-4 space-y-4'

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500 text-sm">Cargando...</div>
  if (!form) return <div className="flex items-center justify-center h-64 text-red-500 text-sm">{error ?? 'Error'}</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Editar Propiedad</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Información básica</h2>
          <div>
            <label className={labelCls}>Título *</label>
            <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Descripción *</label>
            <textarea className={inputCls} rows={4} value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tipo de contrato</label>
              <select className={inputCls} value={form.contractType} onChange={e => set('contractType', e.target.value as ContractType)}>
                <option value="SALE">Venta</option>
                <option value="RENT">Renta</option>
                <option value="DEVELOPMENT">Desarrollo</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Categoría</label>
              <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value as Category)}>
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Departamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="DEVELOPMENT_PROJECT">Proyecto</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Precio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Precio MXN</label>
              <input className={inputCls} type="number" min="0" value={form.priceMXN} onChange={e => set('priceMXN', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Precio USD</label>
              <input className={inputCls} type="number" min="0" value={form.priceUSD} onChange={e => set('priceUSD', e.target.value)} />
            </div>
            <div className="flex items-end gap-2 col-span-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.priceVisible} onChange={e => set('priceVisible', e.target.checked)} className="rounded" />
                Precio visible
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Ubicación</h2>
          <div>
            <label className={labelCls}>Dirección *</label>
            <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Ciudad *</label>
              <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Estado *</label>
              <input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>C.P.</label>
              <input className={inputCls} value={form.zipCode} onChange={e => set('zipCode', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Detalles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              ['bedrooms', 'Recámaras'],
              ['bathrooms', 'Baños'],
              ['halfBaths', 'Medios baños'],
              ['parkingSpots', 'Estacionamientos'],
              ['areaSqm', 'Área (m²)'],
              ['landAreaSqm', 'Terreno (m²)'],
              ['floors', 'Plantas'],
              ['yearBuilt', 'Año construcción'],
            ] as [keyof FormState, string][]).map(([field, label]) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <input className={inputCls} type="number" min="0" value={form[field] as string} onChange={e => set(field, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Amenities & Features */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Amenidades y características</h2>
          <div>
            <label className={labelCls}>Amenidades (separadas por coma)</label>
            <input className={inputCls} value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="Alberca, Gimnasio, Jardín" />
          </div>
          <div>
            <label className={labelCls}>Características (separadas por coma)</label>
            <input className={inputCls} value={form.features} onChange={e => set('features', e.target.value)} placeholder="Cocina integral, Clósets" />
          </div>
        </div>

        {/* Media */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Multimedia</h2>
          <div>
            <label className={labelCls}>Fotos</label>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors bg-[#18140D] text-[#C9A96E] hover:bg-[#2E2820]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {uploading ? 'Subiendo…' : 'Agregar fotos'}
              <input type="file" accept="image/*" multiple disabled={uploading} onChange={e => handlePhotos(e.target.files)} className="hidden" />
            </label>
            {uploading && <p className="text-xs text-gray-500 mt-2">Subiendo...</p>}
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200">
                    <img src={p} alt={`Foto ${i + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={labelCls}>URL de video</label>
            <input className={inputCls} value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
          </div>
        </div>

        {/* Contact & Status */}
        <div className={sectionCls}>
          <h2 className="text-sm font-bold text-[#1e3a5f]">Contacto y estado</h2>
          <div>
            <label className={labelCls}>WhatsApp</label>
            <input className={inputCls} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+52 55 0000 0000" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="rounded" />
              Activa
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="rounded" />
              Destacada
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/propiedades')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving || uploading} className="bg-[#1e3a5f] text-white hover:bg-[#16305a]">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
