import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CategoriesTable from '@/components/admin/CategoriesTable'

export default async function CategoriasPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    include: { subcategories: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light text-foreground" style={{ fontFamily: 'Georgia, serif' }}>Categorías</h1>
      </div>
      <CategoriesTable
        categories={categories.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() }))}
      />
    </div>
  )
}
