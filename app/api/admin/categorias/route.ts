import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await prisma.category.findMany({
    include: { subcategories: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slug, icon, order } = body

  if (!name || !slug) return NextResponse.json({ error: 'Nombre y slug requeridos' }, { status: 400 })

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 409 })

  const category = await prisma.category.create({
    data: { name, slug, icon: icon || null, order: order ?? 0 },
    include: { subcategories: true },
  })
  return NextResponse.json(category, { status: 201 })
}
