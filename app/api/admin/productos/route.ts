import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    include: { category: { select: { id: true, name: true } }, subcategory: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slug, description, categoryId, subcategoryId, featured, mainImage, images } = body

  if (!name || !slug || !categoryId) {
    return NextResponse.json({ error: 'Nombre, slug y categoría requeridos' }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 409 })

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      categoryId,
      subcategoryId: subcategoryId || null,
      featured: !!featured,
      mainImage: mainImage || null,
      images: Array.isArray(images) ? images : [],
    },
    include: { category: { select: { id: true, name: true } }, subcategory: { select: { id: true, name: true } } },
  })
  return NextResponse.json(product, { status: 201 })
}
