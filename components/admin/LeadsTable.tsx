'use client'

import { useState } from 'react'
import { ContactFormEntry, LeadStatus } from '@/types'
import { Button } from '@/components/ui/button'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const STATUS_COLORS: Record<LeadStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  CLOSED: 'bg-green-100 text-green-700',
  DISCARDED: 'bg-slate-100 text-slate-500',
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  PENDING: 'Pendiente',
  CONTACTED: 'Contactado',
  CLOSED: 'Cerrado',
  DISCARDED: 'Descartado',
}

interface Props {
  leads: ContactFormEntry[]
}

export default function LeadsTable({ leads: initial }: Props) {
  const [leads, setLeads] = useState<ContactFormEntry[]>(initial)
  const [photoModal, setPhotoModal] = useState<string[] | null>(null)

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const res = await fetch(`${BASE}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Error al actualizar estado')
    } catch {
      alert('Error al actualizar estado')
    }
  }

  async function saveNotes(id: string, notes: string) {
    try {
      await fetch(`${BASE}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
    } catch {
      alert('Error al guardar notas')
    }
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
      {/* Photo modal */}
      {photoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setPhotoModal(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-800">Fotos del lead</h2>
              <button onClick={() => setPhotoModal(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {photoModal.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm break-all">
                  Foto {i + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1e3a5f] text-white">
              {['Nombre', 'Tipo', 'Email', 'Teléfono', 'Fecha', 'Status', 'Notas', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={lead.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800">{lead.name || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{lead.type}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{lead.email}</td>
                <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                    className={`rounded-full px-2 py-1 text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status]}`}
                  >
                    {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <textarea
                    defaultValue={lead.notes || ''}
                    rows={2}
                    onBlur={(e) => saveNotes(lead.id, e.target.value)}
                    className="w-full min-w-[140px] text-xs border border-slate-200 rounded p-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                    placeholder="Notas..."
                  />
                </td>
                <td className="px-4 py-3">
                  {lead.type === 'SELL' && lead.photos.length > 0 && (
                    <Button size="sm" variant="outline" onClick={() => setPhotoModal(lead.photos)}>
                      Ver fotos
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">Sin leads</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-800">{lead.name || '—'}</div>
                <div className="text-xs text-slate-500">{lead.type} · {fmtDate(lead.createdAt)}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
            <div className="text-xs text-slate-600">{lead.email} · {lead.phone}</div>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
              className="text-xs border border-slate-200 rounded px-2 py-1"
            >
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <textarea
              defaultValue={lead.notes || ''}
              rows={2}
              onBlur={(e) => saveNotes(lead.id, e.target.value)}
              className="text-xs border border-slate-200 rounded p-1 resize-none"
              placeholder="Notas..."
            />
            {lead.type === 'SELL' && lead.photos.length > 0 && (
              <Button size="sm" variant="outline" onClick={() => setPhotoModal(lead.photos)}>
                Ver fotos
              </Button>
            )}
          </div>
        ))}
        {leads.length === 0 && (
          <div className="text-center text-slate-400 py-8">Sin leads</div>
        )}
      </div>
    </>
  )
}
