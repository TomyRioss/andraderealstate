'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const MAX_FILES = 5
const MAX_SIZE_MB = 20
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const inputCls =
  'w-full border border-[#AED6F1] rounded-xl px-4 py-3 text-sm text-[#0D3B66] focus:outline-none focus:border-[#1A5F9E] focus:ring-1 focus:ring-[#1A5F9E] transition bg-white placeholder:text-[#4A7BA7]'
const labelCls = 'block text-sm font-medium text-[#0D3B66] mb-1'

type Mode = 'vender' | 'alquilar'

const modeConfig: Record<Mode, { title: string; subtitle: string; apiType: string; btnLabel: string }> = {
  vender: {
    title: 'Quiero vender',
    subtitle: 'Cargá tu propiedad y te contactamos sin cargo.',
    apiType: 'SELL',
    btnLabel: 'Publicar propiedad',
  },
  alquilar: {
    title: 'Quiero alquilar',
    subtitle: 'Publicá tu propiedad en alquiler y te contactamos.',
    apiType: 'RENT_LISTING',
    btnLabel: 'Publicar alquiler',
  },
}

export default function VenderForm() {
  const [mode, setMode] = useState<Mode>('vender')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const cfg = modeConfig[mode]

  function handleModeChange(m: Mode) {
    setMode(m)
    setBanner(null)
    setPhotoError(null)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError(null)
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > MAX_FILES) {
      setPhotoError(`Máximo ${MAX_FILES} fotos.`)
      e.target.value = ''
      setFiles([])
      return
    }
    const oversized = selected.find((f) => f.size > MAX_SIZE_BYTES)
    if (oversized) {
      setPhotoError(`"${oversized.name}" supera ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      setFiles([])
      return
    }
    setFiles(selected)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBanner(null)
    setPhotoError(null)

    if (files.length > MAX_FILES) {
      setPhotoError(`Máximo ${MAX_FILES} fotos.`)
      return
    }
    const oversized = files.find((f) => f.size > MAX_SIZE_BYTES)
    if (oversized) {
      setPhotoError(`"${oversized.name}" supera ${MAX_SIZE_MB}MB.`)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const photoPaths: string[] = []

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `${Date.now()}-${safeName}`
        const { error } = await supabase.storage.from('contact-uploads').upload(path, file)
        if (error) {
          setBanner({ type: 'error', message: `Error subiendo "${file.name}": ${error.message}` })
          setLoading(false)
          return
        }
        const { data: pub } = supabase.storage.from('contact-uploads').getPublicUrl(path)
        photoPaths.push(pub.publicUrl)
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: cfg.apiType, name, phone, email, address, message, photos: photoPaths }),
      })

      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Propiedad enviada. Te contactamos pronto.' })
        setName('')
        setPhone('')
        setEmail('')
        setAddress('')
        setMessage('')
        setFiles([])
        if (fileRef.current) fileRef.current.value = ''
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
        console.error('[VenderForm] API error:', data)
      }
    } catch (err) {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
      console.error('[VenderForm] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#AED6F1] p-8 max-w-xl w-full mx-auto">
      {/* Toggle */}
      <div className="flex rounded-xl border border-[#AED6F1] overflow-hidden mb-6">
        {(['vender', 'alquilar'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors capitalize ${
              mode === m
                ? 'bg-[#0D3B66] text-white'
                : 'bg-white text-[#4A7BA7] hover:text-[#0D3B66]'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-black text-[#0D3B66] mb-1">{cfg.title}</h2>
      <p className="text-sm text-[#4A7BA7] mb-6">{cfg.subtitle}</p>

      {banner && (
        <div
          className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
            banner.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {banner.type === 'success' && (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {banner.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Nombre completo *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Teléfono *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+52 55 0000 0000"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Correo electrónico *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Dirección de la propiedad *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle y colonia"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Fotos{' '}
            <span className="text-[#4A7BA7] font-normal">(máx. {MAX_FILES} archivos, {MAX_SIZE_MB}MB c/u)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-[#4A7BA7] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0D3B66] file:text-white hover:file:bg-[#1A5F9E] cursor-pointer"
          />
          {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
          {files.length > 0 && !photoError && (
            <p className="mt-1 text-xs text-[#4A7BA7]">{files.length} foto(s) seleccionada(s)</p>
          )}
        </div>

        <div>
          <label className={labelCls}>Mensaje (opcional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Información adicional sobre la propiedad..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0D3B66] hover:bg-[#1A5F9E] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer"
        >
          {loading ? 'Enviando...' : cfg.btnLabel}
        </Button>
      </form>
    </div>
  )
}
