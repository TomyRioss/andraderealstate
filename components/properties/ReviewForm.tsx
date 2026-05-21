'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  propertyId: string
}

export default function ReviewForm({ propertyId: _propertyId }: Props) {
  const [author, setAuthor] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setErrorMsg('Selecciona una calificación'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, location, rating, content }),
      })
      if (res.status === 201) {
        setStatus('success')
        setAuthor(''); setLocation(''); setRating(0); setContent('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Error al enviar reseña')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Error de conexión')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="font-semibold text-[#1e3a5f] text-lg">Dejar una reseña</h3>

      {status === 'success' && (
        <div className="bg-[#10b981]/10 border border-[#10b981] text-[#10b981] rounded-lg px-4 py-3 text-sm">
          Reseña enviada. Será publicada tras revisión.
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          required
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Calificación *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl leading-none focus:outline-none transition-colors"
              style={{ color: star <= rating ? '#10b981' : '#d1d5db' }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comentario * (mín. 10 caracteres)</label>
        <textarea
          required
          minLength={10}
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar reseña'}
      </Button>
    </form>
  )
}
