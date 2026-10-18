import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, slug, icon, order, active } = body

  if (slug) {
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing && existing.id !== id) return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 409 })
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug, icon, order, active },
    include: { subcategories: true },
  })
  return NextResponse.json(category)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
