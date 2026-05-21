'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { ContractType, Category } from '@/types'

interface FormState {
  title: string
  slug: string
  description: string
  contractType: ContractType
  category: Category
  priceMXN: string
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

const defaultForm: FormState = {
  title: '',
  slug: '',
  description: '',
  contractType: 'SALE',
  category: 'HOUSE',
  priceMXN: '',
  priceVisible: true,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  bedrooms: '',
  bathrooms: '',
  halfBaths: '',
  parkingSpots: '',
  areaSqm: '',
  landAreaSqm: '',
  floors: '',
  yearBuilt: '',
  amenities: '',
  features: '',
  whatsapp: '',
  active: true,
  featured: false,
  videoUrl: '',
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function NuevaPropiedad() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [slugManual, setSlugManual] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = useCallback(
    (field: keyof FormState, value: string | boolean) =>
      setForm(prev => ({ ...prev, [field]: value })),
    []
  )

  function handleTitleChange(value: string) {
    set('title', value)
    if (!slugManual) set('slug', toSlug(value))
  }

  function handleSlugChange(value: string) {
    setSlugManual(true)
    set('slug', value)
  }

  async function handlePhotos(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    const supabase = createClient()
    const paths: string[] = []
    try {
      for (const file of Array.from(files)) {
        const path = `properties/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage
          .from('property-images')
          .upload(path, file)
        if (upErr) throw new Error(upErr.message)
        paths.push(path)
      }
      setPhotos(prev => [...prev, ...paths])
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
      const res = await fetch('/api/properties', {
        method: 'POST',
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Nueva Propiedad</h1>

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
            <input className={inputCls} value={form.title} onChange={e => handleTitleChange(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input className={inputCls} value={form.slug} onChange={e => handleSlugChange(e.target.value)} required />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Precio MXN</label>
              <input className={inputCls} type="number" min="0" value={form.priceMXN} onChange={e => set('priceMXN', e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
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
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={e => handlePhotos(e.target.files)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#16305a] cursor-pointer"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Subiendo...</p>}
            {photos.length > 0 && (
              <ul className="mt-2 space-y-1">
                {photos.map(p => (
                  <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="truncate flex-1">{p}</span>
                    <button type="button" onClick={() => removePhoto(p)} className="text-red-500 hover:text-red-700 text-xs shrink-0">Eliminar</button>
                  </li>
                ))}
              </ul>
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
            {saving ? 'Guardando...' : 'Crear propiedad'}
          </Button>
        </div>
      </form>
    </div>
  )
}
