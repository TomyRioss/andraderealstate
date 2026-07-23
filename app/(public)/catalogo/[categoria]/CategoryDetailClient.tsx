'use client'

import { useState } from 'react'
import CatalogItemCard from '@/components/catalogo/CatalogItemCard'
import SubcategoryTabs from '@/components/catalogo/SubcategoryTabs'
import { getSubcategories, type WeddingCategory } from '@/lib/wedding-catalog-data'

export default function CategoryDetailClient({ category }: { category: WeddingCategory }) {
  const subcategories = getSubcategories(category)
  const [active, setActive] = useState('Todos')

  const items =
    active === 'Todos'
      ? category.items
      : category.items.filter((item) => item.subcategory === active)

  return (
    <div className="flex flex-col gap-8">
      {subcategories.length > 0 && (
        <SubcategoryTabs subcategories={subcategories} active={active} onChange={setActive} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <CatalogItemCard key={item.id} item={item} categorySlug={category.slug} categoryName={category.name} />
        ))}
      </div>
    </div>
  )
}
