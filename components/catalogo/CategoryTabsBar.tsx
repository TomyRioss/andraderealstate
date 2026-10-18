import Link from 'next/link'
import { Tent, Armchair, Wine, Layers, Utensils, Music, LucideIcon } from 'lucide-react'
import type { WeddingCategory } from '@/lib/wedding-catalog-data'

const iconMap: Record<string, LucideIcon> = {
  tent: Tent,
  armchair: Armchair,
  wine: Wine,
  layers: Layers,
  utensils: Utensils,
  music: Music,
}

export default function CategoryTabsBar({
  categories,
  activeSlug,
}: {
  categories: WeddingCategory[]
  activeSlug: string
}) {
  return (
    <div className="flex flex-wrap gap-8 items-center overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
      {categories.map((category) => {
        const Icon = iconMap[category.icon ?? ''] ?? Tent
        const isActive = category.slug === activeSlug
        return (
          <Link
            key={category.slug}
            href={`/catalogo/${category.slug}`}
            className={`flex flex-col items-center gap-2 shrink-0 transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${
                isActive
                  ? 'bg-[#D4AF6B]/10 border-[#D4AF6B]/30'
                  : 'border-[#2E2A18]'
              }`}
            >
              <Icon
                className={isActive ? 'w-5 h-5 text-[#D4AF6B]' : 'w-5 h-5 text-[#7A6845]'}
                strokeWidth={1.5}
              />
            </div>
            <span
              className={`text-[10px] tracking-widest uppercase font-medium ${
                isActive ? 'text-[#D4AF6B]' : 'text-[#7A6845]'
              }`}
            >
              {category.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
