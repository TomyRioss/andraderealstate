'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type Tab = 'BUY' | 'SELL'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const MAX_FILES = 10
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function ContactPageClient() {
  const [tab, setTab] = useState<Tab>('BUY')
  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  // BUY fields
  const [buyPhone, setBuyPhone] = useState('')
  const [buyEmail, setBuyEmail] = useState('')
  const [buyMessage, setBuyMessage] = useState('')

  // SELL fields
  const [sellName, setSellName] = useState('')
  const [sellPhone, setSellPhone] = useState('')
  const [sellEmail, setSellEmail] = useState('')
  const [sellAddress, setSellAddress] = useState('')
  const [sellMessage, setSellMessage] = useState('')
  const [sellFiles, setSellFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleTabChange(t: Tab) {
    setTab(t)
    setBanner(null)
    setPhotoError(null)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError(null)
    const files = Array.from(e.target.files ?? [])
    if (files.length > MAX_FILES) {
      setPhotoError(`Maximo ${MAX_FILES} fotos.`)
      e.target.value = ''
      setSellFiles([])
      return
    }
    const oversized = files.find((f) => f.size > MAX_SIZE_BYTES)
    if (oversized) {
      setPhotoError(`"${oversized.name}" supera ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      setSellFiles([])
      return
    }
    setSellFiles(files)
  }

  async function handleBuySubmit(e: React.FormEvent) {
    e.preventDefault()
    setBanner(null)
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'BUY', phone: buyPhone, email: buyEmail, message: buyMessage }),
      })
      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Consulta enviada. Te contactamos pronto.' })
        setBuyPhone('')
        setBuyEmail('')
        setBuyMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSellSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBanner(null)
    setPhotoError(null)

    if (sellFiles.length > MAX_FILES) {
      setPhotoError(`Maximo ${MAX_FILES} fotos.`)
      return
    }
    const oversized = sellFiles.find((f) => f.size > MAX_SIZE_BYTES)
    if (oversized) {
      setPhotoError(`"${oversized.name}" supera ${MAX_SIZE_MB}MB.`)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const photoPaths: string[] = []

      for (const file of sellFiles) {
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
        body: JSON.stringify({
          type: 'SELL',
          name: sellName,
          phone: sellPhone,
          email: sellEmail,
          address: sellAddress,
          message: sellMessage,
          photos: photoPaths,
        }),
      })

      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Propiedad enviada. Te contactamos pronto.' })
        setSellName('')
        setSellPhone('')
        setSellEmail('')
        setSellAddress('')
        setSellMessage('')
        setSellFiles([])
        if (fileRef.current) fileRef.current.value = ''
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] bg-[#f8f9ff]'
  const labelCls = 'block text-sm font-medium text-[#1e3a5f] mb-1'

  return (
    <div className="bg-white rounded-xl shadow-sm max-w-xl mx-auto p-6 sm:p-8">
      {/* Tab toggle */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
        {(['BUY', 'SELL'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-white text-[#1e3a5f] hover:bg-gray-50'
            }`}
          >
            {t === 'BUY' ? 'Comprar' : 'Vender'}
          </button>
        ))}
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {banner.message}
        </div>
      )}

      {tab === 'BUY' ? (
        <form onSubmit={handleBuySubmit} className="space-y-4">
          <div>
            <p className="text-base font-bold text-[#1e3a5f] mb-1">Quiero comprar</p>
            <p className="text-xs text-gray-400 mb-4">Dejanos tus datos y te asesoramos.</p>
          </div>

          <div>
            <label className={labelCls}>Telefono *</label>
            <input
              type="tel"
              required
              value={buyPhone}
              onChange={(e) => setBuyPhone(e.target.value)}
              placeholder="+54 9 11 0000-0000"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              required
              value={buyEmail}
              onChange={(e) => setBuyEmail(e.target.value)}
              placeholder="tu@email.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Mensaje</label>
            <textarea
              value={buyMessage}
              onChange={(e) => setBuyMessage(e.target.value)}
              rows={4}
              placeholder="Contanos que buscas..."
              className={inputCls}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] hover:bg-[#0ea572] text-white font-semibold py-3 rounded-lg"
          >
            {loading ? 'Enviando...' : 'Enviar consulta'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSellSubmit} className="space-y-4">
          <div>
            <p className="text-base font-bold text-[#1e3a5f] mb-1">Quiero vender</p>
            <p className="text-xs text-gray-400 mb-4">Cargá tu propiedad y te contactamos.</p>
          </div>

          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              type="text"
              required
              value={sellName}
              onChange={(e) => setSellName(e.target.value)}
              placeholder="Tu nombre completo"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Telefono *</label>
            <input
              type="tel"
              required
              value={sellPhone}
              onChange={(e) => setSellPhone(e.target.value)}
              placeholder="+54 9 11 0000-0000"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              required
              value={sellEmail}
              onChange={(e) => setSellEmail(e.target.value)}
              placeholder="tu@email.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Direccion de la propiedad *</label>
            <input
              type="text"
              required
              value={sellAddress}
              onChange={(e) => setSellAddress(e.target.value)}
              placeholder="Calle 1234, Ciudad"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>
              Fotos{' '}
              <span className="text-gray-400 font-normal">(max {MAX_FILES} archivos, {MAX_SIZE_MB}MB c/u)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#1e3a5f] file:text-white hover:file:bg-[#1e3a5f]/90 cursor-pointer"
            />
            {photoError && (
              <p className="mt-1 text-xs text-red-500">{photoError}</p>
            )}
            {sellFiles.length > 0 && !photoError && (
              <p className="mt-1 text-xs text-gray-400">{sellFiles.length} foto(s) seleccionada(s)</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Mensaje</label>
            <textarea
              value={sellMessage}
              onChange={(e) => setSellMessage(e.target.value)}
              rows={4}
              placeholder="Informacion adicional sobre la propiedad..."
              className={inputCls}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] hover:bg-[#0ea572] text-white font-semibold py-3 rounded-lg"
          >
            {loading ? 'Enviando...' : 'Publicar propiedad'}
          </Button>
        </form>
      )}
    </div>
  )
}
