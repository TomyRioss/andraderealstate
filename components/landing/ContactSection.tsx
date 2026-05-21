'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormType } from '@/types'

type Tab = FormType

interface BuyFields {
  phone: string
  email: string
  message: string
}

interface SellFields {
  name: string
  phone: string
  email: string
  address: string
  message: string
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition'

export default function ContactSection() {
  const [tab, setTab] = useState<Tab>('BUY')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [buy, setBuy] = useState<BuyFields>({ phone: '', email: '', message: '' })
  const [sell, setSell] = useState<SellFields>({ name: '', phone: '', email: '', address: '', message: '' })

  const validate = (): string | null => {
    if (tab === 'BUY') {
      if (!buy.phone.trim()) return 'El teléfono es requerido'
      if (!buy.email.trim()) return 'El email es requerido'
    } else {
      if (!sell.name.trim()) return 'El nombre es requerido'
      if (!sell.phone.trim()) return 'El teléfono es requerido'
      if (!sell.email.trim()) return 'El email es requerido'
      if (!sell.address.trim()) return 'La dirección es requerida'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setErrorMsg(err)
      return
    }
    setErrorMsg('')
    setStatus('loading')

    const body = tab === 'BUY'
      ? { type: 'BUY', phone: buy.phone, email: buy.email, message: buy.message || undefined }
      : { type: 'SELL', name: sell.name, phone: sell.phone, email: sell.email, address: sell.address, message: sell.message || undefined }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 201) {
        setStatus('success')
        setBuy({ phone: '', email: '', message: '' })
        setSell({ name: '', phone: '', email: '', address: '', message: '' })
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.message || 'Error al enviar el formulario')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Error de conexión. Intenta nuevamente.')
      setStatus('error')
    }
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2 font-sans text-center">
          Contáctanos
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Cuéntanos qué necesitas y te respondemos a la brevedad
        </p>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => { setTab('BUY'); setStatus('idle'); setErrorMsg('') }}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              tab === 'BUY' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Quiero Comprar
          </button>
          <button
            type="button"
            onClick={() => { setTab('SELL'); setStatus('idle'); setErrorMsg('') }}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              tab === 'SELL' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Quiero Vender
          </button>
        </div>

        {status === 'success' ? (
          <div className="rounded-xl bg-[#f0fdf4] border border-[#10b981] text-[#065f46] text-center py-8 px-4 text-sm font-medium">
            Mensaje enviado. Nos comunicaremos contigo pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'BUY' ? (
              <>
                <input
                  type="tel"
                  placeholder="Teléfono *"
                  className={inputClass}
                  value={buy.phone}
                  onChange={e => setBuy(b => ({ ...b, phone: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email *"
                  className={inputClass}
                  value={buy.email}
                  onChange={e => setBuy(b => ({ ...b, email: e.target.value }))}
                />
                <textarea
                  placeholder="Mensaje (opcional)"
                  rows={4}
                  className={inputClass}
                  value={buy.message}
                  onChange={e => setBuy(b => ({ ...b, message: e.target.value }))}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nombre *"
                  className={inputClass}
                  value={sell.name}
                  onChange={e => setSell(s => ({ ...s, name: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Teléfono *"
                  className={inputClass}
                  value={sell.phone}
                  onChange={e => setSell(s => ({ ...s, phone: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email *"
                  className={inputClass}
                  value={sell.email}
                  onChange={e => setSell(s => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Dirección de la propiedad *"
                  className={inputClass}
                  value={sell.address}
                  onChange={e => setSell(s => ({ ...s, address: e.target.value }))}
                />
                <textarea
                  placeholder="Mensaje (opcional)"
                  rows={4}
                  className={inputClass}
                  value={sell.message}
                  onChange={e => setSell(s => ({ ...s, message: e.target.value }))}
                />
              </>
            )}

            {errorMsg && (
              <p className="text-red-500 text-xs">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#1e3a5f] hover:bg-[#0f172a] text-white font-semibold py-2.5"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
