'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'

interface Variant {
  id: string
  name: string
  description: string | null
  images: string[]
}

interface Product {
  id: string
  name: string
  description: string | null
  mainImage: string | null
  images: string[]
  category: { name: string }
  subcategory: { name: string } | null
  variants: Variant[]
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { add } = useWeddingCart()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = product.variants.find((v) => v.id === selectedId) ?? null

  const gallery = selected
    ? selected.images
    : [product.mainImage, ...product.images].filter(Boolean) as string[]
  const description = selected?.description || product.description

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square rounded-xl overflow-hidden border border-[#2E2A18] bg-[#1A1810]">
          {gallery[0] && (
            <Image
              key={gallery[0]}
              src={gallery[0]}
              alt={selected ? `${product.name} — ${selected.name}` : product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
        </div>
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {gallery.slice(1).map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-[#2E2A18] bg-[#1A1810]">
                <Image src={url} alt={product.name} fill sizes="120px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[#D4AF6B] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            {product.category.name}
            {product.subcategory && ` · ${product.subcategory.name}`}
          </p>
          <h1 className="font-semibold text-3xl md:text-4xl text-[#F5EDD8] leading-tight mb-4">
            {product.name}
            {selected && <span className="text-[#7A6845]"> — {selected.name}</span>}
          </h1>
          <p className="text-sm md:text-base text-[#7A6845] leading-relaxed">
            {description || 'Sin descripción disponible.'}
          </p>
        </div>

        {product.variants.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#D4AF6B] mb-3">
              Variaciones
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {product.variants.map((variant) => {
                const isActive = variant.id === selectedId
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(isActive ? null : variant.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all ${
                      isActive
                        ? 'bg-[#D4AF6B] text-[#111009] border-[#D4AF6B]'
                        : 'border-[#2E2A18] text-[#7A6845] hover:border-[#D4AF6B]/50 hover:text-[#D4AF6B]'
                    }`}
                  >
                    {variant.name}
                  </button>
                )
              })}
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Volver a la variación original"
                  title="Volver a la variación original"
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-[#2E2A18] text-[#7A6845] hover:border-[#D4AF6B]/50 hover:text-[#D4AF6B] transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            selected
              ? add({
                  itemId: `${product.id}:${selected.id}`,
                  categoryName: product.category.name,
                  name: `${product.name} — ${selected.name}`,
                  imageUrl: selected.images[0] ?? product.mainImage ?? '',
                  price: 0,
                  unitLabel: '',
                })
              : add({
                  itemId: product.id,
                  categoryName: product.category.name,
                  name: product.name,
                  imageUrl: product.mainImage ?? '',
                  price: 0,
                  unitLabel: '',
                })
          }
          className="w-full md:w-auto self-start border border-[#D4AF6B]/40 text-[#D4AF6B] px-8 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#D4AF6B] hover:text-[#111009] transition-all"
        >
          Agregar a mi plan
        </button>
      </div>
    </div>
  )
}
