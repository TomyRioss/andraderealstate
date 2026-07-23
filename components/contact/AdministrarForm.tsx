'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const MAX_FILES = 5
const MAX_SIZE_MB = 20
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const inputCls =
  'w-full border border-[#2E2A18] rounded-xl px-4 py-3 text-sm text-[#F5EDD8] focus:outline-none focus:border-[#2E2A18] focus:ring-1 focus:ring-[#D4AF6B] transition bg-[#1A1810] placeholder:text-[#D4AF6B]'
const labelCls = 'block text-sm font-medium text-[#F5EDD8] mb-1'

export default function AdministrarForm() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

    setLoading(true)
    try {
      let photoPaths: string[] = []

      if (files.length > 0) {
        const uploadData = new FormData()
        uploadData.append('folder', 'contact-uploads')
        files.forEach((file) => uploadData.append('files', file))
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}))
          setBanner({ type: 'error', message: data?.error ?? 'Error subiendo fotos.' })
          setLoading(false)
          return
        }
        const uploadJson = await uploadRes.json()
        photoPaths = uploadJson.urls
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MANAGE',
          name: `${nombre} ${apellido}`.trim(),
          phone,
          email: email || undefined,
          address,
          photos: photoPaths,
        }),
      })

      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Solicitud enviada. Un vendedor te contactará por WhatsApp pronto.' })
        setNombre('')
        setApellido('')
        setPhone('')
        setEmail('')
        setAddress('')
        setFiles([])
        if (fileRef.current) fileRef.current.value = ''
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
        console.error('[AdministrarForm] API error:', data)
      }
    } catch (err) {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
      console.error('[AdministrarForm] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1A1810] rounded-2xl shadow-sm border border-[#2E2A18] p-8 max-w-xl w-full mx-auto">
      <h2 className="text-xl font-bold text-[#F5EDD8] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
        Quiero administrar mi propiedad
      </h2>
      <p className="text-sm text-[#7A6845] mb-6">
        Completá el formulario y un vendedor te contactará por WhatsApp.
      </p>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Apellido *</label>
            <input
              type="text"
              required
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Tu apellido"
              className={inputCls}
            />
          </div>
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
          <label className={labelCls}>
            Correo electrónico <span className="text-[#D4AF6B] font-normal">(opcional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Dirección del inmueble *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, colonia y ciudad"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Fotos del inmueble{' '}
            <span className="text-[#D4AF6B] font-normal">(opcional · máx. {MAX_FILES} archivos, {MAX_SIZE_MB}MB c/u)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-[#7A6845] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF6B] file:text-white hover:file:bg-[#9A6028] cursor-pointer"
          />
          {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
          {files.length > 0 && !photoError && (
            <p className="mt-1 text-xs text-[#D4AF6B]">{files.length} foto(s) seleccionada(s)</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D4AF6B] hover:bg-[#9A6028] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer"
        >
          {loading ? 'Enviando...' : 'Solicitar administración'}
        </Button>
      </form>
    </div>
  )
}
