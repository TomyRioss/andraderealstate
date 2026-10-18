'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'
import type { WeddingCategory, WeddingItem } from '@/lib/wedding-catalog-data'

export default function CatalogItemCard({
  item,
  categorySlug,
  categoryName,
}: {
  item: WeddingItem
  categorySlug: WeddingCategory['slug']
  categoryName: WeddingCategory['name']
}) {
  const { add } = useWeddingCart()

  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#2E2A18] bg-[#1A1810] transition-all hover:border-[#D4AF6B]/50">
      <Link href={`/catalogo/${categorySlug}/${item.slug}`} className="absolute inset-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1A1810] text-[#7A6845]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-[11px] uppercase tracking-widest">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111009] via-[#111009]/20 to-transparent" />
      </Link>
      <div className="absolute bottom-0 left-0 w-full bg-[#1A1810]/80 backdrop-blur-md border-t border-[#2E2A18] p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <Link href={`/catalogo/${categorySlug}/${item.slug}`}>
          <h3 className="text-sm font-semibold text-[#F5EDD8] leading-snug mb-1 hover:text-[#D4AF6B] transition-colors">{item.name}</h3>
        </Link>
        <p className="text-xs text-[#7A6845] mb-4">{item.description}</p>
        <button
          type="button"
          onClick={() =>
            add({
              itemId: item.id,
              categoryName,
              name: item.name,
              imageUrl: item.imageUrl ?? '',
              price: item.price,
              unitLabel: item.unitLabel ?? '',
            })
          }
          className="relative w-full border border-[#D4AF6B]/40 text-[#D4AF6B] py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#D4AF6B] hover:text-[#111009] transition-all"
        >
          Agregar a mi plan
        </button>
      </div>
    </div>
  )
}
