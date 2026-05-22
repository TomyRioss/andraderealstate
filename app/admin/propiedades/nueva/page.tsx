'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { ContractType, Category } from '@/types'

const PropertyMap = dynamic(() => import('@/components/ui/PropertyMap'), { ssr: false })

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
  mapsUrl: string
}

const defaultForm: FormState = {
  title: '', slug: '', description: '',
  contractType: 'SALE', category: 'HOUSE',
  priceMXN: '', priceUSD: '', priceVisible: true,
  address: '', city: '', state: '', zipCode: '',
  bedrooms: '', bathrooms: '', halfBaths: '', parkingSpots: '',
  areaSqm: '', landAreaSqm: '', floors: '', yearBuilt: '',
  amenities: '', features: '',
  whatsapp: '', active: true, featured: false, videoUrl: '', mapsUrl: '',
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-[#E5DDD5] bg-[#FAF8F5] text-sm text-[#18140D] focus:outline-none focus:border-[#C9A96E] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-[#8C7B68]">{label}</label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-[#E5DDD5] p-6 flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">{title}</p>
      {children}
    </section>
  )
}

export default function NuevaPropiedad() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [slugManual, setSlugManual] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = useCallback(
    (field: keyof FormState, value: string | boolean) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  )

  const mapCoords = useMemo(() => {
    const url = form.mapsUrl
    if (!url) return null
    // Format: @lat,lng or ?q=lat,lng or !3dlat!4dlng
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (atMatch) return { lat: parseFloat(atMatch[1]!), lng: parseFloat(atMatch[2]!) }
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (qMatch) return { lat: parseFloat(qMatch[1]!), lng: parseFloat(qMatch[2]!) }
    const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
    if (dMatch) return { lat: parseFloat(dMatch[1]!), lng: parseFloat(dMatch[2]!) }
    return null
  }, [form.mapsUrl])

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setPhotoError(null)
    const supabase = createClient()
    try {
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `properties/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage.from('property-images').upload(path, file)
        if (upErr) throw new Error(`"${file.name}": ${upErr.message}`)
        const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path)
        setPhotos((prev) => [...prev, pub.publicUrl])
      }
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : 'Error al subir')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleTitleChange(value: string) {
    set('title', value)
    if (!slugManual) set('slug', toSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const num = (v: string) => (v === '' ? undefined : Number(v))
    const str = (v: string) => (v === '' ? undefined : v)

    const body = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      contractType: form.contractType,
      category: form.category,
      priceMXN: num(form.priceMXN),
      priceUSD: num(form.priceUSD),
      priceVisible: form.priceVisible,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: str(form.zipCode),
      bedrooms: num(form.bedrooms),
      bathrooms: num(form.bathrooms),
      halfBaths: num(form.halfBaths),
      parkingSpots: num(form.parkingSpots),
      areaSqm: num(form.areaSqm),
      landAreaSqm: num(form.landAreaSqm),
      floors: num(form.floors),
      yearBuilt: num(form.yearBuilt),
      amenities: form.amenities ? form.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split(',').map((s) => s.trim()).filter(Boolean) : [],
      whatsapp: str(form.whatsapp),
      videoUrl: str(form.videoUrl),
      mapsUrl: str(form.mapsUrl),
      active: form.active,
      featured: form.featured,
      photos,
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(typeof data.error === 'string' ? data.error : 'Error al crear propiedad')
      }
      setSuccess(true)
      setTimeout(() => router.push('/admin/propiedades'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/propiedades')}
          className="text-[#8C7B68] hover:text-[#C9A96E] transition-colors"
          aria-label="Volver"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-light" style={{ color: '#18140D', fontFamily: 'Georgia, serif' }}>
          Nueva propiedad
        </h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          Propiedad creada. Redirigiendo…
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Section title="Identificación">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Título *">
              <input
                required
                className={inputCls}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej: Casa en Las Lomas"
              />
            </Field>
            <Field label="Slug *">
              <input
                required
                className={inputCls}
                value={form.slug}
                onChange={(e) => { setSlugManual(true); set('slug', e.target.value) }}
                placeholder="casa-en-las-lomas"
              />
            </Field>
            <Field label="Ciudad *">
              <input required className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Ciudad de México" />
            </Field>
            <Field label="Estado *">
              <input required className={inputCls} value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="CDMX" />
            </Field>
            <Field label="Código postal">
              <input className={inputCls} value={form.zipCode} onChange={(e) => set('zipCode', e.target.value)} placeholder="11000" />
            </Field>
          </div>
          <Field label="Dirección *">
            <input required className={inputCls} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Calle, número, colonia" />
          </Field>
          <Field label="Descripción *">
            <textarea
              required
              rows={4}
              className={inputCls}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Descripción detallada…"
            />
          </Field>
        </Section>

        <Section title="Clasificación y precio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Tipo de contrato">
              <select className={inputCls} value={form.contractType} onChange={(e) => set('contractType', e.target.value as ContractType)}>
                <option value="SALE">Venta</option>
                <option value="RENT">Renta</option>
                <option value="DEVELOPMENT">Desarrollo</option>
              </select>
            </Field>
            <Field label="Categoría">
              <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value as Category)}>
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Departamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="DEVELOPMENT_PROJECT">Proyecto</option>
                <option value="OTHER">Otro</option>
              </select>
            </Field>
            <Field label="Precio MXN">
              <input type="number" min={0} className={inputCls} value={form.priceMXN} onChange={(e) => set('priceMXN', e.target.value)} placeholder="3500000" />
            </Field>
            <Field label="Precio USD">
              <input type="number" min={0} className={inputCls} value={form.priceUSD} onChange={(e) => set('priceUSD', e.target.value)} placeholder="180000" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-6">
            {([
              ['priceVisible', 'Precio visible'],
              ['active', 'Activa'],
              ['featured', 'Destacada'],
            ] as [keyof FormState, string][]).map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 text-sm text-[#5C4F42] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[field] as boolean}
                  onChange={(e) => set(field, e.target.checked)}
                  className="accent-[#C9A96E]"
                />
                {label}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Características">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              ['bedrooms', 'Recámaras'],
              ['bathrooms', 'Baños'],
              ['halfBaths', 'Medios baños'],
              ['parkingSpots', 'Estacionamientos'],
              ['floors', 'Pisos'],
              ['yearBuilt', 'Año construcción'],
              ['areaSqm', 'Área (m²)'],
              ['landAreaSqm', 'Terreno (m²)'],
            ] as [keyof FormState, string][]).map(([field, label]) => (
              <Field key={field} label={label}>
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={form[field] as string}
                  onChange={(e) => set(field, e.target.value)}
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title="Amenidades y características">
          <Field label="Amenidades (separar con coma)">
            <input className={inputCls} value={form.amenities} onChange={(e) => set('amenities', e.target.value)} placeholder="Alberca, Gimnasio, Jardín" />
          </Field>
          <Field label="Características (separar con coma)">
            <input className={inputCls} value={form.features} onChange={(e) => set('features', e.target.value)} placeholder="Cocina integral, Clósets" />
          </Field>
        </Section>

        <Section title="Contacto y media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="WhatsApp">
              <input className={inputCls} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+52 55 1234 5678" />
            </Field>
            <Field label="URL de video">
              <input className={inputCls} value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
            </Field>
          </div>
          <Field label="Link de Google Maps">
            <input
              className={inputCls}
              value={form.mapsUrl}
              onChange={(e) => set('mapsUrl', e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
            />
          </Field>
          {mapCoords && (
            <div>
              <p className="text-xs text-[#8C7B68] mb-2">Vista previa del mapa</p>
              <PropertyMap lat={mapCoords.lat} lng={mapCoords.lng} mapsUrl={form.mapsUrl} />
            </div>
          )}
          {form.mapsUrl && !mapCoords && (
            <p className="text-xs text-amber-600">No se pudo parsear lat/lng del link. Verifica que sea un link directo de Google Maps (no acortado).</p>
          )}
        </Section>

        <Section title="Fotos">
          {photoError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{photoError}</p>
          )}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors bg-[#18140D] text-[#C9A96E] hover:bg-[#2E2820]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {uploading ? 'Subiendo…' : 'Subir fotos'}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => handlePhotoUpload(e.target.files)}
              />
            </label>
            {photos.length > 0 && (
              <span className="text-xs text-[#8C7B68]">{photos.length} foto(s)</span>
            )}
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-[#E5DDD5]">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="flex gap-3 justify-end pb-8">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/propiedades')}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#18140D] hover:bg-[#2E2820] text-[#C9A96E] font-semibold"
          >
            {saving ? 'Guardando…' : 'Crear propiedad'}
          </Button>
        </div>
      </form>
    </div>
  )
}
