'use client'

import { useState } from 'react'
import { Testimonial, TestimonialStatus } from '@/types'
import { Button } from '@/components/ui/button'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const STATUS_COLORS: Record<TestimonialStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<TestimonialStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
}

interface Props {
  testimonials: Testimonial[]
}

export default function TestimonialsTable({ testimonials: initial }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function setStatus(id: string, status: TestimonialStatus) {
    setLoading(`${id}-${status}`)
    try {
      const res = await fetch(`${BASE}/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    } catch {
      alert('Error al actualizar testimonio')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este testimonio?')) return
    setLoading(`${id}-delete`)
    try {
      const res = await fetch(`${BASE}/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch {
      alert('Error al eliminar testimonio')
    } finally {
      setLoading(null)
    }
  }

  const stars = (n: number) => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(Math.max(0, 5 - n))
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  const truncate = (s: string, max = 80) => s.length > max ? s.slice(0, max) + '…' : s

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1e3a5f] text-white">
              {['Autor', 'Ubicación', 'Rating', 'Reseña', 'Fecha', 'Status', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800">{t.author}</td>
                <td className="px-4 py-3 text-slate-600">{t.location || '—'}</td>
                <td className="px-4 py-3 text-amber-500 whitespace-nowrap">{stars(t.rating)}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[220px]">
                  <span title={t.content}>{truncate(t.content)}</span>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[t.status]}`}>
                    {STATUS_LABELS[t.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {t.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading === `${t.id}-APPROVED`}
                        onClick={() => setStatus(t.id, 'APPROVED')}
                      >
                        Aprobar
                      </Button>
                    )}
                    {t.status !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={loading === `${t.id}-REJECTED`}
                        onClick={() => setStatus(t.id, 'REJECTED')}
                      >
                        Rechazar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={loading === `${t.id}-delete`}
                      onClick={() => handleDelete(t.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Sin testimonios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-800">{t.author}</div>
                <div className="text-xs text-slate-500">{t.location || '—'} · {fmtDate(t.createdAt)}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[t.status]}`}>
                {STATUS_LABELS[t.status]}
              </span>
            </div>
            <div className="text-amber-500 text-sm">{stars(t.rating)}</div>
            <div className="text-xs text-slate-600" title={t.content}>{truncate(t.content)}</div>
            <div className="flex gap-2 flex-wrap mt-1">
              {t.status !== 'APPROVED' && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setStatus(t.id, 'APPROVED')}>
                  Aprobar
                </Button>
              )}
              {t.status !== 'REJECTED' && (
                <Button size="sm" variant="outline" className="border-red-300 text-red-600"
                  onClick={() => setStatus(t.id, 'REJECTED')}>
                  Rechazar
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center text-slate-400 py-8">Sin testimonios</div>
        )}
      </div>
    </>
  )
}
