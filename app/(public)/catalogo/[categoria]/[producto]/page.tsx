export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import WeddingCartMobileTrigger from '@/components/wedding/WeddingCartMobileTrigger'
import ProductDetailClient from './ProductDetailClient'

async function getProduct(categoria: string, producto: string) {
  const product = await prisma.product.findFirst({
    where: { slug: producto, active: true, category: { slug: categoria } },
    include: {
      category: true,
      subcategory: true,
      variants: { where: { active: true } },
    },
  })
  return product
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>
}): Promise<Metadata> {
  const { categoria, producto } = await params
  const product = await getProduct(categoria, producto)
  if (!product) return {}
  return {
    title: `${product.name} | Catálogo | Grupo Chalita`,
    description: product.description ?? undefined,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>
}) {
  const { categoria, producto } = await params
  const product = await getProduct(categoria, producto)

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-[#111009] px-4 md:px-20 pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <Link
          href={`/catalogo/${categoria}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#7A6845] hover:text-[#D4AF6B] transition-colors mb-8"
        >
          ← {product.category.name}
        </Link>

        <ProductDetailClient product={product} />
      </div>
      <WeddingCartMobileTrigger />
    </main>
  )
}
