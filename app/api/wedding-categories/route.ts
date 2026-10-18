export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toWeddingCategory } from '@/lib/wedding-catalog-data'

export async function GET() {
  try {
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
    return NextResponse.json(categories.map(toWeddingCategory))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
