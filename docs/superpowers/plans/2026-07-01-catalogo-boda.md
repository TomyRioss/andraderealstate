# Catálogo Boda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/catalogo` — a grid of 6 event-rental categories, each linking to a detail page listing its products, with subcategory tabs where applicable.

**Architecture:** Static typed data module (`lib/wedding-catalog-data.ts`) feeds two server-rendered pages (`app/(public)/catalogo/page.tsx` and `app/(public)/catalogo/[categoria]/page.tsx`) built from small presentational components under `components/catalogo/`. Subcategory filtering is client-side (no query params, no server round-trip).

**Tech Stack:** Next.js App Router, TypeScript, TailwindCSS (utility classes with project hex palette, no CSS vars — matches existing `PropertyCard.tsx` pattern), `next/image`, `next/link`, `lucide-react` icons.

## Global Constraints

- No Prisma/DB changes of any kind — data is static TS, no migrations, no schema edits.
- TailwindCSS only, no raw CSS, never touch `globals.css`.
- Color palette (project "Violeta lujo"): bg `#0E0A12`, surface `#160F1F`, border `#2A1D35`, muted `#6A5070`, accent2 `#7B4F80`, accent `#9B6FA0`, text `#EDE0F5`. Use hex literals directly in Tailwind classes (e.g. `bg-[#160F1F]`), matching `components/properties/PropertyCard.tsx`.
- `--accent` (`#9B6FA0`) reserved for exactly one priority action per view — don't apply it to more than one element per page.
- Mobile-first responsive: base styles for mobile, `md:`/`lg:` breakpoints for desktop.
- No custom SVG unless explicitly requested — use `lucide-react` icons only.
- Max 500 lines per component file — split if exceeded.
- No tests exist in this repo currently (`package.json` has no test script) — verification is via `npm run build`/`npm run lint` and manual browser check, not automated test files.

---

### Task 1: Static catalog data module

**Files:**
- Create: `lib/wedding-catalog-data.ts`

**Interfaces:**
- Produces: `WeddingCategorySlug` (union type), `WeddingCategory` interface, `WeddingItem` interface, `weddingCategories: WeddingCategory[]` (exported const), `getCategoryBySlug(slug: string): WeddingCategory | undefined` (exported function), `getSubcategories(category: WeddingCategory): string[]` (exported function, returns unique non-null subcategory names in stable order).

- [ ] **Step 1: Write the data module**

```typescript
// lib/wedding-catalog-data.ts

export type WeddingCategorySlug =
  | 'toldos'
  | 'mobiliario'
  | 'cristaleria'
  | 'manteleria'
  | 'catering'
  | 'pistas-de-baile'

export interface WeddingItem {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  unitLabel: string
  subcategory?: string
}

export interface WeddingCategory {
  slug: WeddingCategorySlug
  name: string
  icon: string
  items: WeddingItem[]
}

export const weddingCategories: WeddingCategory[] = [
  {
    slug: 'toldos',
    name: 'Toldos',
    icon: 'tent',
    items: [
      {
        id: 'toldo-royal-arch',
        name: 'Royal Arch Pavilion',
        description: 'Estructura arqueada 20m x 40m en tela premium translúcida.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 3500,
        unitLabel: 'por evento',
      },
      {
        id: 'toldo-nocturnal-gazebo',
        name: 'Nocturnal Glass Gazebo',
        description: 'Estructura moderna 15m x 15m con paneles de vidrio templado.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 2200,
        unitLabel: 'por evento',
      },
      {
        id: 'toldo-celestial-dome',
        name: 'Celestial Silk Dome',
        description: 'Domo de 30m de diámetro en seda pura con detalles bohemios.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 5800,
        unitLabel: 'por evento',
      },
    ],
  },
  {
    slug: 'mobiliario',
    name: 'Mobiliario',
    icon: 'armchair',
    items: [
      {
        id: 'mob-silla-ghost',
        name: 'Ghost Acrylic Set',
        description: 'Set de 100 sillas transparentes acabado pulido.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 1100,
        unitLabel: 'por evento',
        subcategory: 'Sillas',
      },
      {
        id: 'mob-silla-tiffany',
        name: 'Silla Tiffany Dorada',
        description: 'Silla clásica dorada, ideal para ceremonias elegantes.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 8,
        unitLabel: 'por unidad',
        subcategory: 'Sillas',
      },
      {
        id: 'mob-mesa-velvet',
        name: 'Velvet Nocturne Table',
        description: 'Mesa para 12 personas con manteles y linos a medida.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 850,
        unitLabel: 'por mesa',
        subcategory: 'Mesas',
      },
      {
        id: 'mob-mesa-redonda',
        name: 'Mesa Redonda Imperial',
        description: 'Mesa redonda para 10 personas, base de madera lacada.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 620,
        unitLabel: 'por mesa',
        subcategory: 'Mesas',
      },
    ],
  },
  {
    slug: 'cristaleria',
    name: 'Cristalería',
    icon: 'wine',
    items: [
      {
        id: 'cris-copa-champagne',
        name: 'Copa Champagne Cristal',
        description: 'Copa de cristal fino para brindis, set de 50 unidades.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 90,
        unitLabel: 'set de 50',
        subcategory: 'Copas y Vasos',
      },
      {
        id: 'cris-vaso-whisky',
        name: 'Vaso Whisky Tallado',
        description: 'Vaso bajo tallado a mano, set de 50 unidades.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 75,
        unitLabel: 'set de 50',
        subcategory: 'Copas y Vasos',
      },
      {
        id: 'cris-plato-porcelana',
        name: 'Plato Porcelana Blanca',
        description: 'Plato principal de porcelana fina con borde dorado.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 120,
        unitLabel: 'set de 50',
        subcategory: 'Vajilla',
      },
      {
        id: 'cris-cubiertos-plata',
        name: 'Cubiertos Baño de Plata',
        description: 'Juego de cubiertos completo, set de 50 personas.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 150,
        unitLabel: 'set de 50',
        subcategory: 'Vajilla',
      },
    ],
  },
  {
    slug: 'manteleria',
    name: 'Mantelería',
    icon: 'layers',
    items: [
      {
        id: 'mant-lino-blanco',
        name: 'Mantel Lino Blanco',
        description: 'Mantel de lino premium, caída completa al piso.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 45,
        unitLabel: 'por mesa',
      },
      {
        id: 'mant-terciopelo-vino',
        name: 'Mantel Terciopelo Vino',
        description: 'Mantel de terciopelo color vino con textura suave.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 60,
        unitLabel: 'por mesa',
      },
      {
        id: 'mant-camino-dorado',
        name: 'Camino de Mesa Dorado',
        description: 'Camino de mesa bordado en hilo dorado.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 20,
        unitLabel: 'por mesa',
      },
    ],
  },
  {
    slug: 'catering',
    name: 'Catering',
    icon: 'utensils',
    items: [
      {
        id: 'cat-menu-gourmet',
        name: 'Menú Gourmet 3 Tiempos',
        description: 'Entrada, plato fuerte y postre, servicio de mesa completo.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 45,
        unitLabel: 'por persona',
      },
      {
        id: 'cat-barra-libre',
        name: 'Barra Libre Premium',
        description: 'Barra abierta con bartenders, 6 horas de servicio.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 25,
        unitLabel: 'por persona',
      },
      {
        id: 'cat-mesa-postres',
        name: 'Mesa de Postres',
        description: 'Estación de postres finos con presentación decorada.',
        imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        price: 900,
        unitLabel: 'por evento',
      },
    ],
  },
  {
    slug: 'pistas-de-baile',
    name: 'Pistas de Baile',
    icon: 'music',
    items: [
      {
        id: 'pista-ivory-gloss',
        name: 'Ivory Gloss Stage',
        description: 'Pista de baile 10m x 10m acabado brillante con núcleo reforzado.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        price: 1900,
        unitLabel: 'por evento',
      },
      {
        id: 'pista-led-monogram',
        name: 'Pista LED con Monograma',
        description: 'Pista iluminada con monograma personalizado en LED.',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        price: 2400,
        unitLabel: 'por evento',
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): WeddingCategory | undefined {
  return weddingCategories.find((c) => c.slug === slug)
}

export function getSubcategories(category: WeddingCategory): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of category.items) {
    if (item.subcategory && !seen.has(item.subcategory)) {
      seen.add(item.subcategory)
      result.push(item.subcategory)
    }
  }
  return result
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/wedding-catalog-data.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/wedding-catalog-data.ts
git commit -m "feat(catalogo): add static wedding catalog data"
```

---

### Task 2: CategoryCard + CategoryGrid components

**Files:**
- Create: `components/catalogo/CategoryCard.tsx`
- Create: `components/catalogo/CategoryGrid.tsx`

**Interfaces:**
- Consumes: `WeddingCategory` from `lib/wedding-catalog-data.ts` (Task 1).
- Produces: `CategoryCard` (default export, props `{ category: WeddingCategory }`), `CategoryGrid` (default export, props `{ categories: WeddingCategory[] }`) — used by Task 4 (`/catalogo/page.tsx`).

- [ ] **Step 1: Write CategoryCard**

```tsx
// components/catalogo/CategoryCard.tsx
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

export default function CategoryCard({ category }: { category: WeddingCategory }) {
  const Icon = iconMap[category.icon] ?? Tent

  return (
    <Link href={`/catalogo/${category.slug}`} className="group block">
      <div className="bg-[#160F1F] rounded-xl border border-[#2A1D35] p-6 flex flex-col items-center gap-4 text-center hover:border-[#9B6FA0]/50 hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-[#7B4F80]/10 border border-[#7B4F80]/20 flex items-center justify-center group-hover:bg-[#7B4F80]/20 transition-all">
          <Icon className="w-6 h-6 text-[#9B6FA0]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#EDE0F5] tracking-wide">{category.name}</h3>
          <p className="text-xs text-[#6A5070] mt-1">{category.items.length} productos</p>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Write CategoryGrid**

```tsx
// components/catalogo/CategoryGrid.tsx
import CategoryCard from './CategoryCard'
import type { WeddingCategory } from '@/lib/wedding-catalog-data'

export default function CategoryGrid({ categories }: { categories: WeddingCategory[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `components/catalogo/CategoryCard.tsx` or `CategoryGrid.tsx`

- [ ] **Step 4: Commit**

```bash
git add components/catalogo/CategoryCard.tsx components/catalogo/CategoryGrid.tsx
git commit -m "feat(catalogo): add category card and grid components"
```

---

### Task 3: CatalogItemCard + SubcategoryTabs components

**Files:**
- Create: `components/catalogo/CatalogItemCard.tsx`
- Create: `components/catalogo/SubcategoryTabs.tsx`

**Interfaces:**
- Consumes: `WeddingItem` from `lib/wedding-catalog-data.ts` (Task 1).
- Produces: `CatalogItemCard` (default export, props `{ item: WeddingItem }`), `SubcategoryTabs` (default export, props `{ subcategories: string[]; active: string; onChange: (value: string) => void }`) — both used by Task 5 (`/catalogo/[categoria]/page.tsx` client wrapper).

- [ ] **Step 1: Write CatalogItemCard**

```tsx
// components/catalogo/CatalogItemCard.tsx
import Image from 'next/image'
import type { WeddingItem } from '@/lib/wedding-catalog-data'

export default function CatalogItemCard({ item }: { item: WeddingItem }) {
  return (
    <div className="bg-[#160F1F] rounded-xl overflow-hidden border border-[#2A1D35] hover:border-[#9B6FA0]/40 transition-all duration-300">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-[#EDE0F5] leading-snug mb-1.5">{item.name}</h3>
        <p className="text-xs text-[#6A5070] mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-baseline justify-between border-t border-[#2A1D35] pt-3">
          <span className="text-lg font-semibold text-[#9B6FA0]">
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.price)}
          </span>
          <span className="text-xs text-[#6A5070] tracking-wide">{item.unitLabel}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write SubcategoryTabs**

```tsx
// components/catalogo/SubcategoryTabs.tsx
'use client'

interface SubcategoryTabsProps {
  subcategories: string[]
  active: string
  onChange: (value: string) => void
}

export default function SubcategoryTabs({ subcategories, active, onChange }: SubcategoryTabsProps) {
  const options = ['Todos', ...subcategories]

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase border transition-all ${
              isActive
                ? 'bg-[#9B6FA0] text-[#0E0A12] border-[#9B6FA0]'
                : 'border-[#2A1D35] text-[#6A5070] hover:text-[#EDE0F5] hover:border-[#7B4F80]/50'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `components/catalogo/CatalogItemCard.tsx` or `SubcategoryTabs.tsx`

- [ ] **Step 4: Commit**

```bash
git add components/catalogo/CatalogItemCard.tsx components/catalogo/SubcategoryTabs.tsx
git commit -m "feat(catalogo): add catalog item card and subcategory tabs components"
```

---

### Task 4: Catalog index page (`/catalogo`)

**Files:**
- Create: `app/(public)/catalogo/page.tsx`

**Interfaces:**
- Consumes: `weddingCategories` from `lib/wedding-catalog-data.ts` (Task 1), `CategoryGrid` from `components/catalogo/CategoryGrid.tsx` (Task 2).

- [ ] **Step 1: Write the page**

```tsx
// app/(public)/catalogo/page.tsx
import type { Metadata } from 'next'
import CategoryGrid from '@/components/catalogo/CategoryGrid'
import { weddingCategories } from '@/lib/wedding-catalog-data'

export const metadata: Metadata = {
  title: 'Catálogo | Grupo Chalita',
  description: 'Explorá nuestro catálogo de rubros para eventos: toldos, mobiliario, cristalería, mantelería, catering y pistas de baile.',
}

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-[#0E0A12] px-4 md:px-20 pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <span className="text-[#9B6FA0] text-xs font-semibold tracking-[0.3em] uppercase">
            Catálogo
          </span>
          <h1 className="font-semibold text-3xl md:text-5xl text-[#EDE0F5] leading-tight">
            Elegí los rubros para tu evento
          </h1>
        </div>
        <CategoryGrid categories={weddingCategories} />
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `app/(public)/catalogo/page.tsx`

- [ ] **Step 3: Manual verification**

Run: `npm run dev` (if not already running), then open `http://localhost:3000/catalogo`
Expected: page renders a 2-column (mobile) / 3-column (desktop) grid of 6 category cards; each links to `/catalogo/<slug>`

- [ ] **Step 4: Commit**

```bash
git add "app/(public)/catalogo/page.tsx"
git commit -m "feat(catalogo): add catalog index page"
```

---

### Task 5: Category detail page (`/catalogo/[categoria]`)

**Files:**
- Create: `app/(public)/catalogo/[categoria]/page.tsx`
- Create: `app/(public)/catalogo/[categoria]/CategoryDetailClient.tsx`

**Interfaces:**
- Consumes: `getCategoryBySlug`, `getSubcategories`, `WeddingCategory` from `lib/wedding-catalog-data.ts` (Task 1); `CatalogItemCard`, `SubcategoryTabs` from Task 3.
- Produces: `CategoryDetailClient` (default export, props `{ category: WeddingCategory }`) — client component holding the active-subcategory filter state, used only by this page.

- [ ] **Step 1: Write the client filter wrapper**

```tsx
// app/(public)/catalogo/[categoria]/CategoryDetailClient.tsx
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
          <CatalogItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write the server page**

```tsx
// app/(public)/catalogo/[categoria]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import CategoryDetailClient from './CategoryDetailClient'
import { getCategoryBySlug, weddingCategories } from '@/lib/wedding-catalog-data'

export function generateStaticParams() {
  return weddingCategories.map((category) => ({ categoria: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>
}): Promise<Metadata> {
  const { categoria } = await params
  const category = getCategoryBySlug(categoria)
  if (!category) return {}
  return {
    title: `${category.name} | Catálogo | Grupo Chalita`,
    description: `Productos de ${category.name} disponibles para tu evento.`,
  }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const category = getCategoryBySlug(categoria)

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0E0A12] px-4 md:px-20 pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs text-[#6A5070] hover:text-[#EDE0F5] transition-colors mb-8 uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>
        <h1 className="font-semibold text-3xl md:text-5xl text-[#EDE0F5] leading-tight mb-10">
          {category.name}
        </h1>
        <CategoryDetailClient category={category} />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing either new file in this task

- [ ] **Step 4: Manual verification**

Run: `npm run dev` (if not already running), then:
- Open `http://localhost:3000/catalogo/mobiliario` — expect tabs "Todos / Sillas / Mesas" and item grid filtering correctly
- Open `http://localhost:3000/catalogo/toldos` — expect no tabs (no subcategories), item grid shows all 3 items
- Open `http://localhost:3000/catalogo/no-existe` — expect Next.js 404 page

- [ ] **Step 5: Commit**

```bash
git add "app/(public)/catalogo/[categoria]/page.tsx" "app/(public)/catalogo/[categoria]/CategoryDetailClient.tsx"
git commit -m "feat(catalogo): add category detail page with subcategory filtering"
```

---

### Task 6: Full build verification

**Files:** none (verification only)

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no new errors in `app/(public)/catalogo/**`, `components/catalogo/**`, `lib/wedding-catalog-data.ts`

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: build succeeds, `/catalogo` and `/catalogo/[categoria]` (6 static params) appear in the route output

- [ ] **Step 3: Manual browser pass on all 6 categories**

Open each of: `/catalogo`, `/catalogo/toldos`, `/catalogo/mobiliario`, `/catalogo/cristaleria`, `/catalogo/manteleria`, `/catalogo/catering`, `/catalogo/pistas-de-baile`
Expected: each loads without console errors, images render, mobile width (375px) and desktop width (1440px) both look correct (no horizontal overflow, cards wrap properly)

- [ ] **Step 4: Commit (only if verification uncovered fixes)**

If Steps 1-3 required code changes, commit them:

```bash
git add -A
git commit -m "fix(catalogo): address lint/build/manual verification issues"
```
