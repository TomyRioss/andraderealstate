import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true } }, subcategory: { select: { id: true } }, variants: { orderBy: { createdAt: 'asc' } } },
    }),
    prisma.category.findMany({
      include: { subcategories: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    }),
  ])

  if (!product) notFound()

  return (
    <div className="flex flex-col h-full max-w-4xl">
      <div className="px-6 py-5">
        <Link href="/admin/productos" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Productos
        </Link>
        <h1 className="text-3xl font-light text-foreground" style={{ fontFamily: 'Georgia, serif' }}>{product.name}</h1>
      </div>
      <div className="px-6">
        <ProductForm categories={categories} product={product} variants={product.variants} />
      </div>
    </div>
  )
}
