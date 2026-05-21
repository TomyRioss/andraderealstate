'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Banner {
  type: 'success' | 'error'
  message: string
}

const inputCls =
  'w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] transition bg-white'
const labelCls = 'block text-sm font-medium text-[#1e3a5f] mb-1'

export default function ComprarForm() {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ type: 'BUY', phone, email, message }),
      })
      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Consulta enviada. Te contactamos pronto.' })
        setPhone('')
        setEmail('')
        setMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: data?.error ?? 'Error al enviar. Intentalo de nuevo.' })
        console.error('[ComprarForm] API error:', data)
      }
    } catch (err) {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
      console.error('[ComprarForm] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8 max-w-xl w-full mx-auto">
      <h2 className="text-xl font-black text-[#1e3a5f] mb-1">Quiero comprar</h2>
      <p className="text-sm text-[#6b7280] mb-6">Dejanos tus datos y te asesoramos sin cargo.</p>

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
          <label className={labelCls}>Mensaje (opcional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="¿Qué tipo de propiedad buscas?"
            className={`${inputCls} resize-none`}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10b981] hover:bg-[#0d9e6e] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer"
        >
          {loading ? 'Enviando...' : 'Enviar consulta'}
        </Button>
      </form>
    </div>
  )
}
