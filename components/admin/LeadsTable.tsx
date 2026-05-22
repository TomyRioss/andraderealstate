'use client'

import { useState } from 'react'
import { ContactFormEntry, LeadStatus } from '@/types'
import { Button } from '@/components/ui/button'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const TYPE_LABELS: Record<string, string> = {
  SELL: 'Venta',
  BUY: 'Compra',
  MANAGE: 'Administración',
}

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
  archived: ContactFormEntry[]
}

type Tab = 'active' | 'archived'

export default function LeadsTable({ leads: initial, archived: initialArchived }: Props) {
  const [tab, setTab] = useState<Tab>('active')
  const [leads, setLeads] = useState<ContactFormEntry[]>(initial)
  const [archived, setArchived] = useState<ContactFormEntry[]>(initialArchived)
  const [photoModal, setPhotoModal] = useState<string[] | null>(null)

  const list = tab === 'active' ? leads : archived

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const res = await fetch(`${BASE}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
    } catch {
      alert('Error al actualizar estado')
    }
  }

  async function saveNotes(id: string, notes: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)))
    setArchived((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)))
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

  async function toggleArchive(lead: ContactFormEntry) {
    const next = !lead.active
    try {
      const res = await fetch(`${BASE}/api/contact/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) throw new Error()
      if (next === false) {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id))
        setArchived((prev) => [{ ...lead, active: false }, ...prev])
      } else {
        setArchived((prev) => prev.filter((l) => l.id !== lead.id))
        setLeads((prev) => [{ ...lead, active: true }, ...prev])
      }
    } catch {
      alert('Error al archivar')
    }
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
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
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {photoModal.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-36 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 mb-4 flex gap-2">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === 'active' ? 'bg-[#18140D] text-[#C9A96E]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Activos <span className="ml-1 opacity-70">({leads.length})</span>
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === 'archived' ? 'bg-[#18140D] text-[#C9A96E]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Archivados <span className="ml-1 opacity-70">({archived.length})</span>
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#18140D] text-[#C9A96E]">
              {['Nombre', 'Tipo', 'Email', 'Teléfono', 'Fecha', 'Status', 'Notas', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((lead, i) => (
              <tr key={lead.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800">{lead.name || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{TYPE_LABELS[lead.type] ?? lead.type}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{lead.email}</td>
                <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  {tab === 'active' ? (
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status]}`}
                    >
                      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {tab === 'active' && (
                    <textarea
                      key={lead.id + (lead.notes ?? '')}
                      defaultValue={lead.notes || ''}
                      rows={2}
                      onBlur={(e) => saveNotes(lead.id, e.target.value)}
                      className="w-full min-w-[140px] text-xs border border-slate-200 rounded p-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
                      placeholder="Notas..."
                    />
                  )}
                  {tab === 'archived' && (
                    <span className="text-xs text-slate-400">{lead.notes || '—'}</span>
                  )}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {['SELL', 'MANAGE'].includes(lead.type) && lead.photos.length > 0 && (
                    <Button size="sm" variant="outline" onClick={() => setPhotoModal(lead.photos)}>
                      Ver fotos
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleArchive(lead)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {tab === 'active' ? 'Archivar' : 'Restaurar'}
                  </Button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  {tab === 'active' ? 'Sin leads activos' : 'Sin leads archivados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3 px-4">
        {list.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-800">{lead.name || '—'}</div>
                <div className="text-xs text-slate-500">{TYPE_LABELS[lead.type] ?? lead.type} · {fmtDate(lead.createdAt)}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
            <div className="text-xs text-slate-600">{lead.email} · {lead.phone}</div>
            {tab === 'active' && (
              <>
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
                  key={lead.id + (lead.notes ?? '')}
                  defaultValue={lead.notes || ''}
                  rows={2}
                  onBlur={(e) => saveNotes(lead.id, e.target.value)}
                  className="text-xs border border-slate-200 rounded p-1 resize-none"
                  placeholder="Notas..."
                />
              </>
            )}
            <div className="flex gap-2">
              {['SELL', 'MANAGE'].includes(lead.type) && lead.photos.length > 0 && (
                <Button size="sm" variant="outline" onClick={() => setPhotoModal(lead.photos)}>
                  Ver fotos
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => toggleArchive(lead)}>
                {tab === 'active' ? 'Archivar' : 'Restaurar'}
              </Button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            {tab === 'active' ? 'Sin leads activos' : 'Sin leads archivados'}
          </div>
        )}
      </div>
    </>
  )
}
