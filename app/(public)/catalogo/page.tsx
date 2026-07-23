export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function CatalogoPage() {
  const first = await prisma.category.findFirst({ where: { active: true }, orderBy: { order: 'asc' } })
  if (!first) redirect('/wedding-plan')
  redirect(`/catalogo/${first.slug}`)
}
