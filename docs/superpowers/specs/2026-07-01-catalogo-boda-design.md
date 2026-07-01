# Catálogo "Arma tu Boda" — Design

## Objetivo
Sección `/catalogo` con 6 categorías de rubros para eventos (Toldos, Mobiliario, Cristalería,
Mantelería, Catering, Pistas de Baile). Cada categoría muestra sus productos; algunas tienen
subcategorías para filtrar.

## Alcance
Solo vista de catálogo + navegación. Sin carrito, sin "wedding planner" sidebar, sin checkout.

## Datos
No se toca Prisma/DB (existe propuesta sin aplicar en `docs/wedding-plan-schema.prisma`, fuera de
alcance). Datos estáticos tipados en `lib/wedding-catalog-data.ts`, con forma compatible a esos
modelos (`WeddingCategory` / `WeddingItem`) para facilitar migración futura.

Categorías y subcategorías:
- Toldos — sin subcategorías
- Mobiliario — Sillas, Mesas
- Cristalería — Copas y Vasos, Vajilla
- Mantelería — sin subcategorías
- Catering — sin subcategorías
- Pistas de Baile — sin subcategorías

Cada item: nombre, descripción corta, precio, unidad (ej. "por evento", "por unidad"), imagen
placeholder (Unsplash o similar), subcategoría opcional.

## Rutas
- `app/(public)/catalogo/page.tsx` — grid de 6 categorías (ícono, nombre, cantidad de items)
- `app/(public)/catalogo/[categoria]/page.tsx` — grid de productos de esa categoría; si tiene
  subcategorías, tabs arriba para filtrar client-side

## Componentes
- `components/catalogo/CategoryCard.tsx` — card de categoría (link a detalle)
- `components/catalogo/CategoryGrid.tsx` — grid de CategoryCard
- `components/catalogo/CatalogItemCard.tsx` — card de producto (imagen, nombre, precio, unidad)
- `components/catalogo/SubcategoryTabs.tsx` — tabs client component para filtrar por subcategoría

## Estilo
TailwindCSS únicamente, variables CSS del proyecto (`--bg`, `--surface`, `--border`, `--muted`,
`--accent`, `--accent2`, `--text`), fuentes `General Sans` / `Poppins`. Mobile-first responsive.
Sin SVG custom salvo íconos ya usados en el proyecto (lucide, si está disponible).

## Fuera de alcance
Wedding planner sidebar, carrito/cotización, persistencia en DB, formulario de contacto por item.
