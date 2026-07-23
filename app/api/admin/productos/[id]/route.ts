import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, slug, description, categoryId, subcategoryId, active, featured, mainImage, images } = body

  if (slug) {
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing && existing.id !== id) return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 409 })
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      categoryId,
      subcategoryId: subcategoryId || null,
      active,
      featured,
      mainImage: mainImage !== undefined ? (mainImage || null) : undefined,
      images: Array.isArray(images) ? images : undefined,
    },
    include: { category: { select: { id: true, name: true } }, subcategory: { select: { id: true, name: true } } },
  })
  return NextResponse.json(product)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
