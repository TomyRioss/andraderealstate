'use client'

import { ShoppingBag } from 'lucide-react'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'

export default function WeddingCartMobileTrigger() {
  const { items, open } = useWeddingCart()

  if (items.length === 0) return null

  return (
    <button
      onClick={open}
      className="lg:hidden fixed bottom-6 right-6 z-40 bg-accent text-bg rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      aria-label="Ver tu plan de boda"
    >
      <ShoppingBag size={22} />
      <span className="absolute -top-1 -right-1 bg-text-brand text-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {items.length}
      </span>
    </button>
  )
}
