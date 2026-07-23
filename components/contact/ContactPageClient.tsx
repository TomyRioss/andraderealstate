'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const inputCls =
  'w-full border border-[#2E2A18] rounded-xl px-4 py-3 text-sm text-[#F5EDD8] focus:outline-none focus:border-[#B8912A] focus:ring-1 focus:ring-[#B8912A] transition bg-[#1A1810] placeholder:text-[#7A6845]'
const labelCls = 'block text-sm font-medium text-[#F5EDD8] mb-1'

export default function ContactPageClient() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBanner(null)
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'GENERAL', name, phone, email, interest, message }),
      })
      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Mensaje enviado. Te contactamos pronto.' })
        setName('')
        setPhone('')
        setEmail('')
        setInterest('')
        setMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
        console.error('[ContactPageClient] API error:', data)
      }
    } catch (err) {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
      console.error('[ContactPageClient] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1A1810] rounded-2xl shadow-sm border border-[#2E2A18] p-8 max-w-xl w-full mx-auto">
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
          <label className={labelCls}>¿En qué te podemos ayudar?</label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={inputCls}
          >
            <option value="">Seleccioná una opción</option>
            <option value="Comprar propiedad">Comprar propiedad</option>
            <option value="Vender propiedad">Vender propiedad</option>
            <option value="Alquilar propiedad">Alquilar propiedad</option>
            <option value="Administración de inmuebles">Administración de inmuebles</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Mensaje (opcional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Contanos más sobre lo que necesitás..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#111009] hover:bg-[#B8912A] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer"
        >
          {loading ? 'Enviando...' : 'Enviar consulta'}
        </Button>
      </form>
    </div>
  )
}
