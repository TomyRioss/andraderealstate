'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const MAX_FILES = 10
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const inputCls =
  'w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] transition bg-white'
const labelCls = 'block text-sm font-medium text-[#1e3a5f] mb-1'

export default function VenderForm() {
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
        const path = `${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('contact-uploads').upload(path, file)
        if (error) {
          setBanner({ type: 'error', message: `Error subiendo "${file.name}": ${error.message}` })
          setLoading(false)
          return
        }
        photoPaths.push(path)
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SELL', name, phone, email, address, message, photos: photoPaths }),
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
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8 max-w-xl w-full mx-auto">
      <h2 className="text-xl font-black text-[#1e3a5f] mb-1">Quiero vender</h2>
      <p className="text-sm text-[#6b7280] mb-6">Cargá tu propiedad y te contactamos sin cargo.</p>

      {banner && (
        <div
          className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'bg-[#d1fae5] text-[#065f46] border border-[#10b981]/30'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
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
            <span className="text-gray-400 font-normal">(máx. {MAX_FILES} archivos, {MAX_SIZE_MB}MB c/u)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#1e3a5f] file:text-white hover:file:bg-[#1e3a5f]/90 cursor-pointer"
          />
          {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
          {files.length > 0 && !photoError && (
            <p className="mt-1 text-xs text-gray-400">{files.length} foto(s) seleccionada(s)</p>
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
          className="w-full bg-[#10b981] hover:bg-[#0d9e6e] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer"
        >
          {loading ? 'Enviando...' : 'Publicar propiedad'}
        </Button>
      </form>
    </div>
  )
}
