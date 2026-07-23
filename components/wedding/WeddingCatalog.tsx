'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'
import { Button } from '@/components/ui/button'
import WeddingCartPanel from './WeddingCartPanel'
import { getWeddingIcon } from './wedding-icons'

export interface WeddingCatalogItem {
  id: string
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  price: number
  unitLabel: string | null
  subcategory: string | null
}

export interface WeddingCatalogCategory {
  id: string
  slug: string
  name: string
  icon: string | null
  items: WeddingCatalogItem[]
}

function ItemCard({
  categorySlug,
  categoryName,
  item,
}: {
  categorySlug: string
  categoryName: string
  item: WeddingCatalogItem
}) {
  const { add } = useWeddingCart()

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border-brand/50 flex items-center p-6 gap-6 group hover:border-accent/30 transition-all duration-300 rounded-xl">
      <Link href={`/catalogo/${categorySlug}/${item.slug}`} className="w-24 h-24 overflow-hidden bg-border-brand/40 relative shrink-0 rounded-lg">
        {!!item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
      </Link>
      <div className="flex-grow min-w-0">
        <Link href={`/catalogo/${categorySlug}/${item.slug}`}>
          <h3 className="font-display text-lg text-text-brand hover:text-accent transition-colors">{item.name}</h3>
        </Link>
        <p className="text-muted-brand text-sm mt-1">{item.description}</p>
      </div>
      <div className="text-right shrink-0">
        <Button
          size="sm"
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
        >
          Agregar
        </Button>
      </div>
    </div>
  )
}

export default function WeddingCatalog({
  categories,
}: {
  categories: WeddingCatalogCategory[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8 space-y-12">
        {categories.map((section) => {
          const items = section.items
          const Icon = getWeddingIcon(section.icon)
          const groups = new Map<string, WeddingCatalogItem[]>()
          for (const item of items) {
            const key = item.subcategory ?? ''
            groups.set(key, [...(groups.get(key) ?? []), item])
          }

          return (
            <section key={section.slug} id={section.slug}>
              <div className="flex items-center gap-4 mb-6 border-b border-border-brand/30 pb-4">
                <Icon className="text-accent" size={28} strokeWidth={1.5} />
                <h2 className="font-display text-2xl uppercase tracking-widest text-accent/80">
                  {section.name}
                </h2>
              </div>

              <div className="space-y-8">
                {Array.from(groups.entries()).map(([subcategory, groupItems]) => (
                  <div key={subcategory || 'default'}>
                    {subcategory && (
                      <h3 className="text-sm uppercase tracking-widest text-muted-brand mb-3">
                        {subcategory}
                      </h3>
                    )}
                    <div className="space-y-4">
                      {groupItems.map((item) => (
                        <ItemCard key={item.id} categorySlug={section.slug} categoryName={section.name} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <Link
                    href={`/catalogo/${section.slug}`}
                    className="flex items-center justify-center border-2 border-dashed border-border-brand rounded-xl py-10 text-sm text-muted-brand hover:text-accent hover:border-accent transition-colors cursor-pointer"
                  >
                    Buscar {section.name.toLowerCase()} en el catálogo
                  </Link>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <aside className="hidden lg:block lg:col-span-4 h-fit sticky top-32">
        <div className="bg-surface/80 backdrop-blur-xl border border-border-brand/50 rounded-xl p-8">
          <WeddingCartPanel />
        </div>
      </aside>
    </div>
  )
}
