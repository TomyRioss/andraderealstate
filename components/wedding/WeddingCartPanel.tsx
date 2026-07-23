'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'
import type { WeddingCategory } from '@/lib/wedding-catalog-data'
import { getWeddingIcon } from './wedding-icons'

interface Banner {
  type: 'success' | 'error'
  message: string
}

export default function WeddingCartPanel() {
  const { items, updateQty, remove, clear } = useWeddingCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [categories, setCategories] = useState<WeddingCategory[]>([])

  useEffect(() => {
    fetch('/api/wedding-categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error('[WeddingCartPanel] failed to load categories', err))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBanner(null)
    setLoading(true)
    try {
      const res = await fetch('/api/wedding/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          items: items.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
        }),
      })
      if (res.status === 201) {
        setBanner({ type: 'success', message: 'Cotización enviada. Un especialista te contactará pronto.' })
        const lines = items.map((i) => `- ${i.name} x${i.quantity}`).join('\n')
        const message = `Hola, soy ${name}. Quiero cotizar mi Plan de Boda:\n\n${lines}\n\nTeléfono: ${phone}`
        window.open(`https://wa.me/523292965459?text=${encodeURIComponent(message)}`, '_blank')
        clear()
        setName('')
        setPhone('')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setBanner({ type: 'error', message: 'Error al enviar. Intentalo de nuevo.' })
        console.error('[WeddingCartPanel] API error:', data)
      }
    } catch (err) {
      setBanner({ type: 'error', message: 'Error de red. Intentalo de nuevo.' })
      console.error('[WeddingCartPanel] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="font-display text-xl text-text-brand border-b border-border-brand/30 pb-6 mb-6">
        Tu Plan de Boda
      </h2>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {categories.map((category) => {
          const categoryItems = items.filter((i) => i.categoryName === category.name)
          const Icon = getWeddingIcon(category.icon)
          return (
            <div key={category.slug}>
              <p className="flex items-center gap-2 font-label-caps text-accent text-xs uppercase tracking-widest mb-3">
                <Icon size={16} strokeWidth={1.5} />
                {category.name}
              </p>
              {categoryItems.length === 0 ? (
                <Link
                  href={`/catalogo/${category.slug}`}
                  className="flex items-center justify-center border border-dashed border-border-brand rounded-lg py-4 text-xs text-muted-brand hover:text-accent hover:border-accent transition-colors cursor-pointer"
                >
                  Buscar {category.name.toLowerCase()} en el catálogo
                </Link>
              ) : (
                <div className="space-y-4">
                  {categoryItems.map((item) => (
                    <div key={item.itemId} className="flex items-center gap-3 border-b border-border-brand/30 pb-4">
                      <div className="w-14 h-14 relative shrink-0 bg-border-brand/40 rounded-lg overflow-hidden">
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-brand text-sm truncate">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateQty(item.itemId, item.quantity - 1)}
                          className="p-1 text-muted-brand hover:text-text-brand"
                          aria-label="Restar"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-text-brand text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.itemId, item.quantity + 1)}
                          className="p-1 text-muted-brand hover:text-text-brand"
                          aria-label="Sumar"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => remove(item.itemId)}
                          className="p-1 text-muted-brand hover:text-red-400"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border-brand/30 pt-4">
          {banner && (
            <div
              className={`mb-3 rounded-xl px-4 py-3 text-sm font-medium ${
                banner.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {banner.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              required
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border-brand rounded-lg px-3 py-2 text-sm text-text-brand bg-bg focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <input
              type="tel"
              required
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border-brand rounded-lg px-3 py-2 text-sm text-text-brand bg-bg focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border-brand rounded-lg px-3 py-2 text-sm text-text-brand bg-bg focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Contactar Especialista'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
