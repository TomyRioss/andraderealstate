import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, description, images, active } = body

  const variant = await prisma.productVariant.update({
    where: { id },
    data: {
      name,
      description,
      images: Array.isArray(images) ? images : undefined,
      active,
    },
  })
  return NextResponse.json(variant)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.productVariant.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
