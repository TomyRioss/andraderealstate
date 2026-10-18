export const dynamic = 'force-dynamic'

import WeddingCatalog from '@/components/wedding/WeddingCatalog'
import WeddingCartMobileTrigger from '@/components/wedding/WeddingCartMobileTrigger'
import { prisma } from '@/lib/prisma'
import { toWeddingCategory } from '@/lib/wedding-catalog-data'

export default async function WeddingPlanPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { active: true },
        orderBy: { order: 'asc' },
        include: { subcategory: { select: { name: true } } },
      },
    },
  })

  return (
    <>
      <main className="pt-32 pb-24 px-5 md:px-20 max-w-[1440px] mx-auto min-h-screen">
        <div className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl mb-4 text-text-brand">
            Arma tu Plan de Boda
          </h1>
          <p className="text-muted-brand max-w-2xl">
            Una selección curada de elementos para crear una atmósfera inolvidable en tu día.
            Explorá el catálogo y agregá lo que necesites a tu plan.
          </p>
        </div>
        <WeddingCatalog categories={categories.map(toWeddingCategory)} />
      </main>
      <WeddingCartMobileTrigger />
    </>
  )
}
