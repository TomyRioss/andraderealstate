'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactFormSidebar() {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, message, type: 'BUY' }),
      })
      if (res.ok) {
        setStatus('success')
        setPhone(''); setEmail(''); setMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Error al enviar')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Error de conexión')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="font-display font-semibold text-[#0D1A2D]">Solicitar información</h3>

      {status === 'success' && (
        <div className="bg-stone-100 border border-stone-300 text-stone-700 rounded px-3 py-2 text-sm">
          Mensaje enviado. Nuestro equipo se pondrá en contacto contigo.
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded px-3 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[#525252] mb-1">Teléfono *</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#525252] mb-1">Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#525252] mb-1">Mensaje</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1A2D] resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#0D1A2D] hover:bg-[#0D1A2D]/90 text-white w-full"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}
