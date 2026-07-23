import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slug, order, categoryId } = body

  if (!name || !slug || !categoryId) {
    return NextResponse.json({ error: 'Nombre, slug y categoría requeridos' }, { status: 400 })
  }

  const existing = await prisma.subcategory.findUnique({ where: { categoryId_slug: { categoryId, slug } } })
  if (existing) return NextResponse.json({ error: 'El slug ya está en uso en esa categoría' }, { status: 409 })

  const subcategory = await prisma.subcategory.create({
    data: { name, slug, order: order ?? 0, categoryId },
  })
  return NextResponse.json(subcategory, { status: 201 })
}
