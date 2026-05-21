'use client'

import { useState } from 'react'
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
  'w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] transition bg-white'

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

    const body =
      tab === 'BUY'
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
        console.error('[ContactSection] API error:', data)
      }
    } catch (err) {
      setErrorMsg('Error de conexión. Intenta nuevamente.')
      setStatus('error')
      console.error('[ContactSection] fetch error:', err)
    }
  }

  return (
    <section id="contacto" className="py-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left col */}
          <div>
            <p className="text-[#10b981] text-xs font-bold uppercase tracking-[0.15em] mb-2">
              Contacto
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-[#6b7280] text-base leading-relaxed mb-10">
              Cuéntanos qué buscas y te contactamos en menos de 24 horas.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1e3a5f] mb-1">
                  Teléfono
                </p>
                <p className="text-[#0f172a] font-medium">+52 55 0000 0000</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1e3a5f] mb-1">
                  Email
                </p>
                <p className="text-[#0f172a] font-medium">contacto@andraderealestate.mx</p>
              </div>
            </div>
          </div>

          {/* Right col — card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-8">

            {/* Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => { setTab('BUY'); setStatus('idle'); setErrorMsg('') }}
                className={`flex-1 py-2.5 text-sm transition-colors ${
                  tab === 'BUY'
                    ? 'bg-[#1e3a5f] text-white font-semibold'
                    : 'bg-white text-[#6b7280] hover:bg-[#f8f9ff]'
                }`}
              >
                Quiero Comprar
              </button>
              <button
                type="button"
                onClick={() => { setTab('SELL'); setStatus('idle'); setErrorMsg('') }}
                className={`flex-1 py-2.5 text-sm transition-colors ${
                  tab === 'SELL'
                    ? 'bg-[#1e3a5f] text-white font-semibold'
                    : 'bg-white text-[#6b7280] hover:bg-[#f8f9ff]'
                }`}
              >
                Quiero Vender
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                    placeholder="Correo electrónico *"
                    className={inputClass}
                    value={buy.email}
                    onChange={e => setBuy(b => ({ ...b, email: e.target.value }))}
                  />
                  <textarea
                    placeholder="Mensaje (opcional)"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={buy.message}
                    onChange={e => setBuy(b => ({ ...b, message: e.target.value }))}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Nombre completo *"
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
                    placeholder="Correo electrónico *"
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
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={sell.message}
                    onChange={e => setSell(s => ({ ...s, message: e.target.value }))}
                  />
                </>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#10b981] hover:bg-[#0d9e6e] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors mt-2 cursor-pointer"
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>

            {status === 'success' && (
              <div className="bg-[#d1fae5] text-[#065f46] rounded-xl px-4 py-3 text-sm font-medium mt-4">
                ¡Mensaje enviado! Te contactaremos en menos de 24 horas.
              </div>
            )}

            {(status === 'error' || errorMsg) && (
              <div className="bg-[#fee2e2] text-[#991b1b] rounded-xl px-4 py-3 text-sm font-medium mt-4">
                {errorMsg || 'Error al enviar el formulario.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
