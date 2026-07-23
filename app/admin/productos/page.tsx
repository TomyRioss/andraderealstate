import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProductsTable from '@/components/admin/ProductsTable'

export default async function ProductosPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
      _count: { select: { variants: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light text-foreground" style={{ fontFamily: 'Georgia, serif' }}>Productos</h1>
      </div>
      <ProductsTable
        products={products.map(p => ({ ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))}
      />
    </div>
  )
}
